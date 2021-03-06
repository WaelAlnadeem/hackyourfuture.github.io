const aws = require('aws-sdk');
const template = require('lodash.template');
const applyToStudentMessage = require('./../emails_template/apply_to_student.txt');
const applyToOrgTemplate = template(require('./../emails_template/apply_to_org.tpl'));

const fromEmail = "info@hackyourfuture.net";

const ses = new aws.SES({
    region: 'eu-west-1'
});


const sendEmail = (toEmail, Data, Subject, cbs = {}) => {

    ses.sendEmail({
        Destination: {
            ToAddresses: [toEmail]
        },
        Message: {
            Body: {
                Text: {
                    Data
                }
            },
            Subject: {
                Data: Subject
            }
        },
        Source: fromEmail
    }, (err, data) => {
        if(err) return cbs.reject(err);
        return cbs.resolve(data);
    });

}

module.exports = (req, res) => {

    const reject = (err) => {
        console.log("===EMAIL NOT SENT===");
        console.log(err);
        res.setState(500).json({ message: 'Something went wrong' });
    };

    const resolve = () => {
        console.log("=== ALL EMAILS ARE SENT!!!");
        res.json({ message: 'You got an email :-)'});
    }

    const cbs = { reject, resolve };

    sendEmail(fromEmail, applyToOrgTemplate({ params: req.body }),'A new student applied', cbs);
    sendEmail(req.body.email, applyToStudentMessage, 'Thank you for applying', cbs);

};
