import vision from '@google-cloud/vision'
import {bucket} from './index.js'


export const generateVoterIdNumber = (firstName : string,lastName : string, gender : string, documentNumber : number, mobile : number) => {
    const AadharNumber = documentNumber.toString().slice(-4);
    const phoneNumber = mobile.toString().slice(5,8);
    const firstLetter = firstName.charAt(2).toUpperCase();
    const secondLetter = lastName.charAt(1).toUpperCase();
    const thirdLetter = gender.charAt(0).toUpperCase();
    let voterID = thirdLetter + secondLetter + firstLetter;
    let i = 0, j= 0;
    while(i<AadharNumber.length && j<phoneNumber.length){
        voterID += AadharNumber[i];
        voterID += phoneNumber[j];
        i++;
        j++;
    }
    while(i<AadharNumber.length){
        voterID += AadharNumber[i];
        i++;
    }
    while(j<phoneNumber.length){
        voterID += phoneNumber[j];
        j++;
    }
    return voterID;
}

export const extractTextFromImage = async (file: string) => {
    const client = new vision.ImageAnnotatorClient({
        keyFilename : "src/skilled-circle-448817-d1-e3457c9445ad.json"
    });
    try {
        const [result] = await client.textDetection(file);
        const text = result.textAnnotations?.[0]?.description || "";
        return text;
    } catch (error) {
        console.error("OCR Error:", error);
        return "";
    }
}

export const getPublicGoogleUrl = async (file : string) => {
    try {
        const fileName = file.split("/").pop();
        if(!fileName) throw new Error("Invalid file name")
        const [url] = await bucket.file(fileName).getSignedUrl({
            version : "v4",
            action : "read",
            expires : Date.now() + 1000 * 60 * 60 
        });
        return url;
    } catch (error) {
        throw new Error("error in getPublicGoogleUrl")
    }
    
}