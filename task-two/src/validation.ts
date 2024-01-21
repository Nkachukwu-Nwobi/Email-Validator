/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */
import * as fs from 'node:fs';
import * as dns from 'node:dns';
const csvtojson = require('csvtojson');
const { convertArrayToCSV } = require('convert-array-to-csv');

async function validateEmailAddresses(inputPath: string[], outputFile: string) {
  function csvToJson() {
    csvtojson()
      .fromFile(inputPath)
      .then((jsonObj: {}) => {
        // Save the JSON data to a new file
        let emailJson = fs.writeFileSync(
          '../fixtures/outputs/small-result.json',
          JSON.stringify(jsonObj, null, 2),
        );
        console.log(
          'Conversion complete. JSON file saved:',
          '../fixtures/outputs/small-result.json',
        );

        return emailJson;
      })
      .catch((error: string) => {
        console.error('Error with converting CSV file to JSON:', error);
      });
  }

  //import new email JSON from new file created
  const emailObject: [] = require('../fixtures/outputs/small-result.json');

  //map emails into new array
  const emailString: string[] = emailObject.map(
    (result: { [key: string]: string }) => result.Emails,
  );

  async function validityChecker(email: string) {
    // Extract the domain from the email address by splitting into an array
    const emailDomain = email.split('@')[1];
    // check for domain validity using DNS MX record
    return new Promise((resolve, reject) => {
      try {
        //check for Mx records for email validity
        dns.resolveMx(emailDomain, (err, addresses) => {
          if (err) {
            return reject('error in checking domain');
          } else {
            // Check if MX records are found and return the valid values
            //console.log(addresses);
            return resolve(addresses.length > 0);
          }
        });
      } catch (error) {
        reject('domain validation error');
      }
      //to catch unhandled errors from the new promise
    }).catch((Error) => {
      return Error;
    });
  }

  async function validGroup(emails: string[]) {
    const validEmails: string[] = [];

    for (const email of emails) {
      if (email) {
        await validityChecker(email)
          .then((result) => {
            if (result === true) {
              validEmails.push(email);
            } else {
              //console.error(`not valid: ${email}`)
            }
          })
          .catch(Error);
      }
    }
    return validEmails;
  }

  async function backToCsv() {
    const header = ['Email'];
    const dataArrays = (await validGroup(emailString)).map((item) => {
      return [item];
    });
    const csvFromArrayOfArrays = convertArrayToCSV(dataArrays, {
      header,
      separator: ',',
    });
    // writing to new csv file
    fs.writeFileSync(outputFile, csvFromArrayOfArrays);
    console.log('the csv file has been created successfully');
  }

  return await backToCsv();
}

export default validateEmailAddresses;
