import uuid from "uuid/v4";
import moment from "moment";
import User from "../User";

class Message {
    constructor({ createdAt = null, text = null, date = new Date(), user = {}, audio = null, video = null , image = null}) {
        this._id            = uuid()
        this.createdAt      = date
        this.createdAdd      = moment(date).format('LLLL');
        this.user = new User(user);
        if (text) {
            this.text = text
        }
        if (image)
            this.image = image
        if (audio)
            this.audio = audio
        if (video)
            this.video = video

    }

}

export default Message
