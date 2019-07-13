var seconds = 15;
const countdown = () => {
    document.querySelector('#countdown').innerHTML = `Redirecting in ${seconds--} seconds...`
    if (seconds == 1) {
        var request = new XMLHttpRequest()

        // Open a new connection, using the GET request on the URL endpoint
        request.open('GET', '/redirect');
        request.send();

        request.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                console.log(this.response);
                document.location = this.response;
            }
        };

        clearInterval(countdown);
    }
};
setInterval(countdown, 1000);