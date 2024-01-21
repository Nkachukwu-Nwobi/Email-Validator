/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */
import * as fs from 'node:fs/promises';
import emailValidator from 'email-validator';
import { error } from 'console';

interface outputType {
  'valid-domains': string[];
  totalEmailsParsed: number;
  totalValidEmails: number;
  categories: { [key: string]: number };
}

async function analyseFiles(inputPaths: string[], outputPath: string) {
  //async function analyseFiles() {

  try {
    let validDomains: Set<string> = new Set();
    let totalEmailsParsed = 0;
    let totalValidEmails = 0;
    let categories: { [key: string]: number } = {};

    for (let input of inputPaths) {
      const inputString: string = await fs.readFile(input, 'utf8');

      const emailArray: string[] = inputString.split('\n').map((email) => {
        return email.trim();
      });

      // to remove header and empty row
      emailArray.pop();
      emailArray.shift();

      totalEmailsParsed += emailArray.length;

      const validEmails: string[] = emailArray.filter((email) => {
        return emailValidator.validate(email);
      });

      totalValidEmails += validEmails.length;

      const validDomain: string[] = validEmails.map((email) => {
        return email.split('@')[1];
      });

      // count occurences of each valid domain and push into empty category object

      validDomain.forEach(function (domain) {
        categories[domain] = (categories[domain] || 0) + 1;
        validDomains.add(domain);
      });
    }
    const outputObject: outputType = {
      'valid-domains': [...validDomains],
      totalEmailsParsed,
      totalValidEmails,
      categories,
    };

    await fs.writeFile(outputPath, JSON.stringify(outputObject, null, 2));
    console.log('new file created');
  } catch {
    console.error(error);
  }
}
export default analyseFiles;
