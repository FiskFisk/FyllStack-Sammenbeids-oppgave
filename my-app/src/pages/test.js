// config backend

function testAPI() {
    fetch("/api/test")
        .then(response => response.json())
        .then(data => {
            console.log(data);  
        })

}