function addtohtml(username, password, email) {
    document.querySelector(".tbody").insertAdjacentHTML("beforeend", `<tr>
        <td class="username">${username}</td>
        <td class="password">${password}</td>
        <td class="email">${email}</td>
        <td><button class="edit btn">Edit</button></td>
        <td><button class="delete btn">Delete</button></td>
    </tr>`)
}

function checkid(user, b) {
    for (let i = 0; i < b.currentusers.length; i++) {
        const element = b.currentusers[i];
        if (element == user) {
            return b.objectsid[i]
        }
    }
}

async function sure(location, id) {
    let a = `<div class="container">
        <div class="conform">
            <div>Do you really want to delete this data?</div>
        </div>
        <div class="btns">
            <button class="yes">Yes</button>
            <button class="no">No</button>
        </div>
    </div>
    <div class="blur"></div>`
    document.body.insertAdjacentHTML("beforeend", a);

    document.querySelector(".yes").addEventListener("click", () => {
        fetch('/delete', { method: "POST", headers: { 'Content-Type': 'text/plain' }, body: (id) })
        document.querySelector(".container").remove();
        document.querySelector(".blur").remove();
        location.remove();
    })

    document.querySelector(".no").addEventListener("click", () => {
        document.querySelector(".container").remove();
        document.querySelector(".blur").remove();
    })
}

async function checkerr(b, username, password, email) {
    console.log(b);
    if (b.err == "11000") {
        document.querySelector(".emailerror").innerHTML = "This email already exsits";
    }
    else {
        addtohtml(username, password, email)
        window.location.href = `/display`
    }
}

async function edit(edituser, editpass, editemail, tr, b) {
    let a = `<div class="editcontainer">
        <div class="conform">
            <h1>Edit</h1>
        </div>
        <div class="inputfilds">
            <div><span>Username</span><span class="editusername"><input type="text" class="addinginput" value="${edituser}"></span></div>
            <div><span>Password</span><span class="editpassword"><input type="text" class="addinginput" value="${editpass}"></span></div>
            <div><span>Email</span><span class="editemail"><input type="text" class="addinginput" value="${editemail}"></span></div>
        </div>
        <button class="done btn">Done</button>
    </div>
    <div class="blur"></div>`
    document.body.insertAdjacentHTML("beforeend", a);

    let currentid = checkid(edituser, b);
    fetch('/editedcurrentid', { method: "POST", headers: { 'Content-Type': 'text/plain' }, body: (currentid) })

    document.querySelector(".done").addEventListener("click", () => {
        let editeduser = document.querySelector(".editusername").querySelector(".addinginput").value
        let editedpass = document.querySelector(".editpassword").querySelector(".addinginput").value
        let editedemail = document.querySelector(".editemail").querySelector(".addinginput").value

        tr.querySelector(".username").innerHTML = editeduser
        tr.querySelector(".password").innerHTML = editedpass
        tr.querySelector(".email").innerHTML = editedemail

        let editeddata = { "username": editeduser, "password": editedpass, "email": editedemail }
        fetch('/editeddata', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editeddata) })

        document.querySelector(".editcontainer").remove();
        document.querySelector(".blur").remove();
    })
}

async function main() {
    let a = await fetch(`/update`)
    let b = await a.json()
    if (document.querySelector(".username") == null) {
        for (let i = 0; i < b.currentusers.length; i++) {
            addtohtml(b.currentusers[i], b.currentpasswords[i], b.currentemails[i])
        }
    }

    Array.from(document.querySelector(".tbody").querySelectorAll(".delete")).forEach(element => {
        element.addEventListener("click", (e) => {
            let currentid = checkid(element.closest('tr').querySelector(".username").innerHTML, b);
            sure(element.closest('tr'), currentid);
        })
    })

    Array.from(document.querySelector(".tbody").querySelectorAll(".edit")).forEach(element => {
        let editmode = false
        element.addEventListener("click", (e) => {
            let edituser = element.closest('tr').querySelector(".username").innerHTML
            let editpass = element.closest('tr').querySelector(".password").innerHTML
            let editemail = element.closest('tr').querySelector(".email").innerHTML
            let currenttr = element.closest('tr');
            editmode = true;
            edit(edituser, editpass, editemail, currenttr, b);

        })
    })

    document.querySelector(".addingaddbtn").addEventListener("click", async (e) => {
        let username = e.currentTarget.closest('tr').querySelector("#addingusername").value
        let password = e.currentTarget.closest('tr').querySelector("#addingpassword").value
        let email = e.currentTarget.closest('tr').querySelector("#addingemail").value
        let addingdata = { "username": username, "password": password, "email": email }
        let pass = document.querySelector("#addingpassword").value
        let count = 0;
        if (username != "" && password != "" && email != "") {

            if (username.length > 10) {
                let html = `You can enter only 11 characters`
                document.querySelector(".usererror").innerHTML = html
            }
            else {
                document.querySelector(".usererror").innerHTML = ""
                if (pass.length < 8) {
                    let html = `You need to enter at least 8 characters`
                    document.querySelector(".passerror").innerHTML = html
                }
                else {
                    document.querySelector(".passerror").innerHTML = ""
                    if (pass.length > 10) {
                        let html = `You can enter only 11 characters`
                        document.querySelector(".passerror").innerHTML = html
                    }
                    else {
                        document.querySelector(".passerror").innerHTML = ""
                        if (!email.includes(".") && !email.includes("@")) {
                            let html = `Please enter valid email`
                            document.querySelector(".emailerror").innerHTML = html
                        }
                        else {
                            document.querySelector(".emailerror").innerHTML = ""
                            console.log("all done");

                            let a = await fetch('/adding', { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(addingdata) })
                            let b = await a.json();
                            checkerr(b, username, password, email);
                            username = e.currentTarget.closest('tr').querySelector("#addingusername").value = ""
                            password = e.currentTarget.closest('tr').querySelector("#addingpassword").value = ""
                            email = e.currentTarget.closest('tr').querySelector("#addingemail").value = ""

                            document.querySelector(".usererror").innerHTML = ""
                            document.querySelector(".passerror").innerHTML = ""
                            document.querySelector(".emailerror").innerHTML = ""
                        }
                    }
                }
            }
        }
        else {
            console.log("please enter username or password or email");
            if (username == "") {
                document.querySelector(".usererror").innerHTML = "Please enter username"
            }
            else {
                document.querySelector(".usererror").innerHTML = ""
            }
            if (password == "") {
                document.querySelector(".passerror").innerHTML = "Please enter password"
            }
            else {
                document.querySelector(".passerror").innerHTML = ""
            }
            if (email == "") {
                document.querySelector(".emailerror").innerHTML = "Please enter email"
            }
            else {
                document.querySelector(".emailerror").innerHTML = ""
            }
        }
    })
}

main();