import * as AppAuth from 'expo-app-auth';
import * as Constants from 'expo-constants';
import * as GoogleSignIn from 'expo-google-sign-in';
import React from 'react';
import { Image, StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native';

// import GoogleSignInButton from './GoogleSignInButton';
const { OAuthRedirect, URLSchemes } = AppAuth;

const isInClient = Constants.appOwnership === 'expo';
if (isInClient) {
    GoogleSignIn.allowInClient();
}

const clientIdForUseInTheExpoClient =
        '302455050686-3k6cnrlhmb6b2ocn2c0j0sfk0f18p99g.apps.googleusercontent.com';
/*
 * Redefine this one with your client ID
 *
 * The iOS value is the one that really matters,
 * on Android this does nothing because the client ID
 * is read from the google-services.json.
 */
const yourClientIdForUseInStandalone = Platform.select({
    android:
        '302455050686-3k6cnrlhmb6b2ocn2c0j0sfk0f18p99g.apps.googleusercontent.com',
    ios:
        '157851373513-bip0o55padtj29hvs1ro22cqoopd5449.apps.googleusercontent.com',
});

const clientId = isInClient
    ? clientIdForUseInTheExpoClient
    : yourClientIdForUseInStandalone;

export default class GoogleApp extends React.Component {
    state = { user: null };

    async componentDidMount() {
        try {
            await GoogleSignIn.initAsync({
                isOfflineEnabled: true,
                isPromptEnabled: true,
                clientId,
            });
            this._syncUserWithStateAsync();
        } catch ({ message }) {
            alert('GoogleSignIn.initAsync(): ' + message);
        }
    }

    _syncUserWithStateAsync = async () => {
        const user = await GoogleSignIn.signInSilentlyAsync();
        console.log('_syncUserWithStateAsync', { user });
        this.setState({ user });
    };

    signOutAsync = async () => {
        try {
            await GoogleSignIn.signOutAsync();
            this.setState({ user: null });
        } catch ({ message }) {
            console.log('signOutAsync: ' + message);
        }
    };

    signInAsync = async () => {
        try {
            await GoogleSignIn.askForPlayServicesAsync();
            const { type, user } = await GoogleSignIn.signInAsync();

            if (type === 'success') {
                console.log('success', type);

                this._syncUserWithStateAsync();
            }
        } catch ({ message }) {
            alert('login: Error:' + message);
        }
    };

    _syncUserWithStateAsync = async () => {
        /*
          const user = await GoogleSignIn.signInSilentlyAsync();
          this.setState({ user });
        */

        const data = await GoogleSignIn.signInSilentlyAsync();
        console.log({ data });
        if (data) {
            const photoURL = await GoogleSignIn.getPhotoAsync(256);
            const user = await GoogleSignIn.getCurrentUserAsync();
            this.setState({
                user: {
                    ...user.toJSON(),
                    photoURL: photoURL || user.photoURL,
                },
            });
        } else {
            this.setState({ user: null });
        }
    };

    get buttonTitle() {
        return this.state.user ? 'Sign-Out of Google' : 'Sign-In with Google';
    }

    render() {
        const scheme = {
            OAuthRedirect,
            URLSchemes,
        };
        const { user } = this.state;
        return (
            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                {user && <GoogleProfile {...user} />}
                <TouchableOpacity onPress={this._toggleAuth}>
                    <Text>
                        {this.buttonTitle}
                    </Text>
                </TouchableOpacity>
                <Text>AppAuth: {JSON.stringify(scheme, null, 2)}</Text>
            </View>
        );
    }

    _toggleAuth = () => {
       alert('Toggle '+ !!this.state.user);
       alert('Toggle '+ this.state.user);
        console.log('Toggle', !!this.state.user);
        if (this.state.user) {
            this._signOutAsync();
        } else {
            this._signInAsync();
        }
    };

    _signOutAsync = async () => {
        try {
            // await GoogleSignIn.disconnectAsync();
            await GoogleSignIn.signOutAsync();
            console.log('Log out successful');
        } catch ({ message }) {
            console.error('Demo: Error: logout: ' + message);
        } finally {
            this.setState({ user: null });
        }
    };

    _signInAsync = async () => {
        try {
            await GoogleSignIn.askForPlayServicesAsync();
            const { type, user } = await GoogleSignIn.signInAsync();
            if (type === 'success') {
                this._syncUserWithStateAsync();
            }
        } catch ({ message }) {
            // console.error('login: Error:' + message);
            alert('login: Error:' + message);
        }
    };
}

class GoogleProfile extends React.PureComponent {
    render() {
        const { photoURL, displayName, email } = this.props;
        return (
            <View style={styles.container}>
                {photoURL && (
                    <Image
                        source={{
                            uri: photoURL,
                        }}
                        style={styles.image}
                    />
                )}
                <View style={{ marginLeft: 12 }}>
                    <Text style={styles.text}>{displayName}</Text>
                    <Text style={styles.text}>{email}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    image: { width: 128, borderRadius: 64, aspectRatio: 1 },
    text: { color: 'black', fontSize: 16, fontWeight: '600' },
});