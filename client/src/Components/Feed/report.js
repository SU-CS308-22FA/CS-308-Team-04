import React, { useRef } from "react";
import emailjs from "@emailjs/browser";

export const Report = () => {
  const sendEmail = (e) => {
    e.preventDefault();

    var templateParams = {
      name: "James",
      notes: "Check this out!",
    };

    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams).then(
      function (response) {
        console.log("SUCCESS!", response.status, response.text);
      },
      function (error) {
        console.log("FAILED...", error);
      }
    );
  };
};
