import fs from 'fs'

function loadUser() {
    return JSON.parse(fs.readFileSync('./data/users.json', 'utf8'))
}

function saveUser(users){
    fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2))
}

//function to able to find an exsting user or to create a new one
export function findOrCreate({name, username}) {
    const lowerUsername = username.toLowerCase()
    let users = loadUser()
    let user = users.find(user => user.username === lowerUsername)
    if (!user) {
        user = {name, username: lowerUsername}
        users.push(user)
        saveUser(users)
    }
    return user
}