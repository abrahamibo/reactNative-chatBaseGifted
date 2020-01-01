import {Image} from "react-native";
import React from "react";

const messages = [
    {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
        },
    },    {
        _id: 0,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
            _id: 4,
            name: 'React Native',
            avatar: () => (
                <Image
                    style={{
                        width: 20,
                        height: 20,
                        marginRight: 10.2
                    }}
                    source={require('../../../assets/icon/search.png')}
                />
            ),
        },
    },
    {
        _id: 2,
        text: 'My message',
        createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
        user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
        },
        // image: 'https://facebook.github.io/react/img/logo_og.png',
        // You can also add a video prop:
        video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        // Any additional custom parameters are passed through
    },
    {
        _id: 3,
        text: 'This is a system messagde',
        createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
        system: true,
        // Any additional custom parameters are passed through
    },
    {
        _id: 7,
        text: '#awesome',
        createdAt: new Date(),
        user: {
            _id: 1,
            name: 'Developer',
        },
    },
    {
      _id: 6,
      text: 'Paris',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'React Native',
      },
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Paris_-_Eiffelturm_und_Marsfeld2.jpg/280px-Paris_-_Eiffelturm_und_Marsfeld2.jpg',
      sent: true,
      received: true,
    },
    {
        _id: 5,
        text: 'Send me a picture!',
        createdAt: new Date(),
        user: {
            _id: 1,
            name: 'Developer',
        },
    },
    {
        _id: 4,
        text: '',
        createdAt: new Date(),
        user: {
            _id: 2,
            name: 'React Native',
        },
        sent: true,
        received: true,
        location: {
          latitude: 48.864601,
          longitude: 2.398704,
        },
    },
    {
        _id: 8,
        text: 'Where are you?',
        createdAt: new Date(),
        user: {
            _id: 1,
            name: 'Developer',
        },
    },
    {
        _id: 9,
        text: 'Yes, and I use #GiftedChat!',
        createdAt: new Date(),
        user: {
            _id: 2,
            name: 'React Native',
        },
        sent: true,
        received: true,
    },
    {
        _id: 10,
        text: 'Are you building a chat app?',
        createdAt: new Date(),
        user: {
            _id: 1,
            name: 'Developer',
        },
    },
    {
        _id: 11,
        text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
        createdAt: new Date(),
        quickReplies: {
            type: 'radio', // or 'checkbox',
            keepIt: true,
            values: [
                {
                    title: '😋 Yes',
                    value: 'yes',
                },
                {
                    title: '📷 Yes, let me show you with a picture!',
                    value: 'yes_picture',
                },
                {
                    title: '😞 Nope. What?',
                    value: 'no',
                },
            ],
        },
        user: {
            _id: 2,
            name: 'React Native',
        },
    },
    {
        _id: 20,
        text: 'This is a quick reply. Do you love Gifted Chat? (checkbox)',
        createdAt: new Date(),
        quickReplies: {
            type: 'checkbox', // or 'checkbox',
            values: [
                {
                    title: 'Yes',
                    value: 'yes',
                },
                {
                    title: 'Yes, let me show you with a picture!',
                    value: 'yes_picture',
                },
                {
                    title: 'Nope. What?',
                    value: 'no',
                },
            ],
        },
        user: {
            _id: 2,
            name: 'React Native',
        },
    },
    {
        _id: 30,
        createdAt: new Date(),
        video: 'https://media.giphy.com/media/3o6ZthZjk09Xx4ktZ6/giphy.mp4',
        user: {
            _id: 2,
            name: 'React Native',
        },
    },
]

export default messages