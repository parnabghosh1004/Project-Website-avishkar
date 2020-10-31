const token = window.location.href.replace(`${window.location.origin}/reset/`, '')

document.getElementById('updatePassword').addEventListener('submit', (e) => {
    e.preventDefault()
    fetch(`/new-password`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token,
            password
        })
    }).then(res => res.json())
        .then(data => {
            if (data.error) {
                window.location.href = `${window.location.origin}/resetPassword`
            }
            else {
                window.location.href = `${window.location.origin}/signin`
            }
        }).catch(e => {
            console.log(e)
        })
})