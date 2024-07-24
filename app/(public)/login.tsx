import {useSignIn} from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { useState } from 'react'
import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

import Spinner from 'react-native-loading-spinner-overlay'

const login = () => {
    const {signIn, setActive, isLoaded} = useSignIn()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const onSignInPress = async () => {
       if(!isLoaded) return

        setLoading(true)

        try {
          //logando
            const completeSignIn = await signIn.create({
                identifier: emailAddress,
                password
            })
            //indica qual usuario esta logado
            await setActive({session: completeSignIn.createdSessionId})
        } catch (error: any) {
            alert(error.errors[0].message)
        } finally {
            setLoading(false)
        }
    }
  return (
     <View style={styles.container}>
      <Spinner visible={loading} />

      <TextInput autoCapitalize="none" placeholder="csbetsonline@gmail.com" value={emailAddress} onChangeText={setEmailAddress} style={styles.inputField} />
      <TextInput placeholder="password" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputField} />

      <Button onPress={onSignInPress} title="Login" color={'#6c47ff'}></Button>

      <Link href="/reset" asChild>
        <Pressable style={styles.button}>
          <Text>Forgot password?</Text>
        </Pressable>
      </Link>
      <Link href="/register" asChild>
        <Pressable style={styles.button}>
          <Text>Create Account</Text>
        </Pressable>
      </Link>
    </View>
  )
}

export default login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    inputField: {
        height: 50,
        marginVertical: 4,
        borderWidth: 1,
        borderColor: '#6c47ff',
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff',
    },
    button: {
        margin: 8,
        alignItems: 'center',
    }
})