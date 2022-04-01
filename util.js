const CryptoJs=require("crypto-js");
const cloudinary = require('cloudinary').v2;
const cloudinaryConfiguration=require('./CloudinaryConfiguration');

const symmetricKey='secret key 123';


exports.encrypt=function(text){
  return CryptoJs.AES.encrypt(text, symmetricKey).toString();
}

exports.decrypt=function(text){
  var bytes=CryptoJs.AES.decrypt(text, symmetricKey);
  return bytes.toString(CryptoJs.enc.Utf8);
}


exports.delete_images=function(image_urls_for_delete){
    cloudinary.config({
      cloud_name: cloudinaryConfiguration.getCloudName(),
      api_key: cloudinaryConfiguration.getApiKey(),
      api_secret: cloudinaryConfiguration.getApiSecret()
    });


   const promises=Object.keys(image_urls_for_delete).map(
         key=>{
          cloudinary.uploader.destroy(image_urls_for_delete[key]);
         });

   promises.forEach(async(promise, i) =>  {
      await(promise);
      }
   );

   console.log(" deleted "+image_urls_for_delete);

  return "ok";

}
