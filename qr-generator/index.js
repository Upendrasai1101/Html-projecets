import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";

// TODO 1: Use the Inquirer package to prompt the user for a URL
inquirer
  .prompt([
    {
      type: "input",
      name: "url",
      message: "Enter the URL you want to convert to a QR code:",
      validate: (input) => {
        if (input.trim() === "") {
          return "Please enter a valid URL.";
        }
        return true;
      },
    },
  ])
  .then((answers) => {
    const url = answers.url;

    // TODO 2: Use the QR-Image package to convert the URL into a QR code image
    const qrCode = qr.image(url, { type: "png" });

    // TODO 3: Save the generated QR code as a PNG file in the local file system
    const fileName = "qr_code.png";
    const outputStream = fs.createWriteStream(fileName);

    qrCode.pipe(outputStream);

    outputStream.on("finish", () => {
      console.log(`\n✅ QR code successfully generated!`);
      console.log(`📁 Saved as: ${fileName}`);
      console.log(`🔗 URL encoded: ${url}`);
    });

    outputStream.on("error", (err) => {
      console.error("❌ Error saving QR code:", err.message);
    });
  })
  .catch((error) => {
    console.error("❌ An error occurred:", error.message);
  });
