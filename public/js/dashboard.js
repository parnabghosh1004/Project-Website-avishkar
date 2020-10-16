if (document.referrer === `${window.location.origin}/signin`) {
    document.querySelector('.toast-head').innerText = "Success !"
    document.querySelector('.toast-body').innerText = "LoggedIn Successfully !"
    $(document).ready(() => {
        $('.toast').toast('show')
    })
}

window.addEventListener('load', () => {
    fetch('/dashboard', {
        method: "post",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
    }).then(res => res.json())
        .then(data => {
            if (data.error) {
                console.log(data.error)
                window.location.href = `${window.location.origin}/signin`
            }
            else {
                document.getElementById('dashboard').innerHTML =
                    `<div class="card m s my-5 mx-5" style="width: 24rem;">
                    <img src="${data.pic}" class="card-img-top rounded" alt="profile">
                    <div class="card-body">
                        <h5>First Name : </h5>
                        <p>${data.firstName}</p>
                        <h5>Last Name : </h5>
                        <p>${data.lastName}</p>
                        <h5>Email : </h5>
                        <p>${data.email}</p>
                        <a href="#" class="btn btn-primary btn-block">Change Profile photo</a>
                    </div>
                </div>
                <div class="accordion mx-5" id="accordionExample" style="width: 70%;">
                <div class="card">
                    <div class="card-header" id="headingOne">
                        <h2 class="mb-0">
                            <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse"
                                data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Create Room
                            </button>
                        </h2>
                    </div>

                    <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                        <div class="card-body">
                            <form id="createRoom">
                                <div class="form-group">
                                    <input type="text" class="form-control" id="roomIdAdmin"
                                        placeholder="Enter any room Id">
                                    <small id="emailHelp" class="form-text text-muted"> *Id should be a strong password</small>
                                </div>
                                <button type="submit" class="btn btn-primary">Create</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header" id="headingTwo">
                        <h2 class="mb-0">
                            <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse"
                                data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Join to Team
                            </button>
                        </h2>
                    </div>
                    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                        <div class="card-body">
                            <form id="joinRoom">
                                <div class="form-group">
                                    <input type="text" class="form-control" id="roomId"
                                        placeholder="Enter team Id to join">
                                </div>
                                <button type="submit" class="btn btn-primary">Join</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header" id="headingThree">
                        <h2 class="mb-0">
                            <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse"
                                data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                My Created Teams
                            </button>
                        </h2>
                    </div>
                    <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                        <div class="card-body">
                        </div>
                    </div>
                </div>
                </div>
                `
            }

        })
        .catch(e => console.log(e))
})


document.addEventListener('change', () => {

    let createRoom = document.getElementById('createRoom')
    let joinRoom = document.getElementById('joinRoom')
    let name = `${JSON.parse(localStorage.getItem('user')).firstName} ${JSON.parse(localStorage.getItem('user')).lastName}`
    let id = `${JSON.parse(localStorage.getItem('user'))._id}`

    createRoom.addEventListener('submit', (e) => {
        e.preventDefault()

        let roomId = document.getElementById('roomIdAdmin').value

        fetch('/createRoom', {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
                'Content-Type': 'application/json',
            },
            method: "post",
            body: JSON.stringify({
                roomId,
                name,
                type: 'admin',
                id
            })
        })
            .then(res => res.json())
            .then(data => {
                window.location.href = `${window.location.origin}/room/${data.roomId}`
            })
            .catch(e => console.log(e))

    })

    joinRoom.addEventListener('submit', (e) => {
        e.preventDefault()

        let roomId = document.getElementById('roomId').value

        fetch('/joinRoom', {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
                'Content-Type': 'application/json',
            },
            method: "post",
            body: JSON.stringify({
                roomId,
                name,
                type: 'user',
                id
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) console.log(data.error)
                else window.location.href = `${window.location.origin}/room/${data.roomId}`
            })
            .catch(e => console.log(e))
    })

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.clear()
        window.location.href = `${window.location.origin}/signin`
    })
})