function getInviteTemplate(frontEndURL, projectURL, owner, project){
    const mailTemplate = `

    <body style=" background-color: #fdfce9;  font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;">
        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css" />
        <div align="center"  >
        <img alt="Kanban logo" src="https://i.ibb.co/7t8NrjC/logo.png"
                    style=" max-width: 297px;"
                    width="297" /></div>
        <table align="center" 
            style="  background-color: #fefefe; width: 660px; ">
            <td>
                <div style="background-color: white;" width="100%">
                    <img
                            alt="Header image" 
                            src="https://i.ibb.co/Lrnp4gT/7fa0568f-7a44-41f8-b903-a87f2e44c698.png"
                             width="660" />
                    <h1
                        style="padding: 20px 0; margin: 0; color: #066c35; direction: ltr; font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 21px; font-weight: normal; letter-spacing: 2px; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">
                        <span>${owner} Invites
                            you to join</span>
                    </h1>
    
                    <div
                        style=" margin: 16px 0px; color:#393d47; font-size:14px;line-height:150%;text-align:center;">
                        <p style="margin: 0; ">
                            ${owner} has invited you to join his
                            project ${project}</p>
                        <p style="margin: 0; ">on <a target="__blank"
                                href="${frontEndURL}">${frontEndURL}</a>
                        </p>
                    </div>
                    <div align="center" class="alignment" style="margin: 10px;">
                        <a href="${projectURL}"
                            style="padding :16px 30px;text-decoration:none; display:inline-block; color:#ffffff;background-color:#eece5e;border-radius:13px; "
                            target="_blank"> VISIT PROJECT</a>
                    </div>
                </div>
            </td>
        </table>
        <div
            style="margin:25px; color:#818181; font-size:14px; text-align:center;">
                Copyright 2023 @ Kanban
        </div>
    </body>`
    return mailTemplate;
}
module.exports = {getInviteTemplate};