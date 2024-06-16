function init() {
    console.log('toll');

}

/**
 * Send the message to the backend
 */
async function sendMessage() {
    let date = getCurrentDate();
    let fd = new FormData()
    let token = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let username = document.getElementById('username').value;
    fd.append('textmessage', document.getElementById('messagefield').value);
    fd.append('csrfmiddlewaretoken', token);
    try {
        showMessagePreview(date, username)
        let response = await fetch('/chat/', {
            method: 'POST',
            body: fd,
        })
        let { message, objTime, objAuthor } = await getResponseDatas(response)
        document.getElementById('deleteMessage').remove();
        showMessage(objTime, objAuthor, message)
    }
    catch (e) {
        handleFailedMessage(e)
    }
}

/**
 * Show the textmessage in red to show that the response was failed
 * @param {*console.error();} e error
 */
function handleFailedMessage(e) {
    console.error('An error occurded', e)
    let errorMessage = document.getElementById('failedMessage');
    if (errorMessage) {
        errorMessage.classList.remove('color-gray');
        errorMessage.classList.add('color-red');
    }
}

/**
 * @returns the variables from the response
 */
async function getResponseDatas(response) {
    let messageJson = await response.json();
    let jsonObj = messageJson;
    return {
        message: jsonObj.fields.text,
        objTime: jsonObj.fields.created_at,
        objAuthor: jsonObj.fields.author
    }
}


/**
 * @returns the preview failed message as html 
 */
function showMessagePreview(date, username) {
    return messageContainer.innerHTML +=/*html*/`
<div id="deleteMessage">
     <span class="color-gray">[${date}]</span> <b>${username}:</b>
      <i id="failedMessage" class="color-gray">${messagefield.value}</i>
</div>`;
}

/**
 * @returns the message as html
 */
function showMessage(objTime, objAuthor, message) {
    return messageContainer.innerHTML += /*html*/`
    <div class="own-message">
      <div>
        <span class="color-gray">${objTime}</span> 
         <div>
          <b>${objAuthor}:</b>
         </div>
         <div class="message-container">
         <i>${message}</i>
        </div>
      </div>
    </div>`;
}

/**
 * 
 * @returns the current date in mm:dd:yyyy format
 */
function getCurrentDate() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    const day = d.getDate();
    const year = d.getFullYear();
    const month = months[d.getMonth()];
    return `${month} ${day}, ${year}`;
}