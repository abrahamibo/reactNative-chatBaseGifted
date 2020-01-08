class User {
    constructor({_id, avatar = null, name}) {
        this._id        = _id
        this.avatar     = avatar
        this.name       = name
    }
}

export default User
