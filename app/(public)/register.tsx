import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Stack } from 'expo-router'
import Spinner from 'react-native-loading-spinner-overlay'
import { useSignIn, useSignUp } from '@clerk/clerk-expo'

const Register = () => {
  
    const {isLoaded, signUp, setActive } = useSignUp()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [pendingVerification, setPendingVerification] = useState(false)

    const onSignUpPress = async () => {
        if(!isLoaded) return

        setLoading(true)

        try {
            //criar usuario no clerk
            await signUp.create({
                emailAddress,
                password
            })

            //enviar email de verificação
            await signUp.prepareEmailAddressVerification({strategy: 'email_code'})
            
            //troca UI para verificar email
            setPendingVerification(true)
        } catch (error: any) {
            alert(error.errors[0].message)
        } finally {
            setLoading(false)
        }
    }
    const onPressVerify = async () => {
        if(!isLoaded) return

        setLoading(true)

        try {
            const completeSingUp = await signUp.attemptEmailAddressVerification({code})
            await setActive({session: completeSingUp.createdSessionId})

        } catch (error: any) {
            alert(error.errors[0].message) 
            
        } finally {
            setLoading(false)
        }
    }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
      <Spinner visible={loading} />

      {!pendingVerification && (
        <>
          <TextInput autoCapitalize="none" placeholder="csbetsonline@gmail.com" value={emailAddress} onChangeText={setEmailAddress} style={styles.inputField} />
          <TextInput placeholder="password" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputField} />

          <Button onPress={onSignUpPress} title="Sign up" color={'#6c47ff'}></Button>
        </>
      )}

      {pendingVerification && (
        <>
          <View>
            <TextInput value={code} placeholder="Code..." style={styles.inputField} onChangeText={setCode} />
          </View>
          <Button onPress={onPressVerify} title="Verify emailAddress" color={'#6c47ff'}></Button>
        </>
      )}
    </View>
  )
}

export default Register

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
