function init() {
    console.log('toll');

}

async function sendMessage() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    let day = d.getDate();
    let year = d.getFullYear();
    let month = months[d.getMonth()];
    let date = `${month} ${day}, ${year}`
    let fd = new FormData()
    let token = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let username = document.getElementById('username').value;
    fd.append('textmessage', document.getElementById('messagefield').value);
    fd.append('csrfmiddlewaretoken', token);
    try {
        messageContainer.innerHTML +=/*html*/`
             <div id="deleteMessage">
                  <span class="color-gray">[${date}]</span> <b>${username}:</b>
                   <i id="failedMessage" class="color-gray">${messagefield.value}</i>
             </div>`;

        let response = await fetch('/chat/', {
            method: 'POST',
            body: fd,
        })
        let messageJson = await response.json();
        let jsonObj = messageJson;
        let message = jsonObj.fields.text
        let objTime = jsonObj.fields.created_at
        let objAuthor = jsonObj.fields.author
        console.log(message);
        console.log('success')
        document.getElementById('deleteMessage').remove();
        messageContainer.innerHTML += /*html*/`
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
    catch (e) {
        console.error('An error occurded', e)
        let errorMessage = document.getElementById('failedMessage');
        if (errorMessage) {
            errorMessage.classList.remove('color-gray');
            errorMessage.classList.add('color-red');
        }
    }
}