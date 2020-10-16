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
                            <form>
                                <div class="form-group">
                                    <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                                        placeholder="Enter any room name">
                                </div>
                                <div class="form-group">
                                    <input type="text" class="form-control" id="exampleInputPassword1"
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
                            <form>
                                <div class="form-group">
                                    <input type="text" class="form-control" id="exampleInputPassword1"
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

document.getElementById('logout').addEventListener('click', () => {
    localStorage.clear()
    window.location.href = `${window.location.origin}/signin`
})