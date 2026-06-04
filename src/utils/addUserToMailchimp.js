// import mailchimp from "../config/mailchimp.js";
import mailchimp from "@mailchimp/mailchimp_marketing";

const addUserToMailchimp = async (email, name) => {
    try {

        mailchimp.setConfig({
            apiKey: process.env.MAILCHIMP_API_KEY,
            server: process.env.MAILCHIMP_SERVER,
        });


        const response = await mailchimp.lists.addListMember(
            process.env.MAILCHIMP_AUDIENCE_ID,
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: name
                }
            }
        );

        return response;
    } catch (error) {
        console.log("Mailchimp error:", error);
    }
};

export default addUserToMailchimp;