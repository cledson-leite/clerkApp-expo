import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { useSignIn } from '@clerk/clerk-expo'
import { Stack } from 'expo-router'

const PwdReset = () => {
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [successCreated, setSuccessCreated] = useState(false)
  const {signIn, setActive} = useSignIn()
  
  //requer um code para resetar senha pelo email
  const onRequestReset = async () => {
    try {
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      })
      setSuccessCreated(true)
    } catch (error: any) {
      alert(error.errors[0].message) 
      
    }
  }

  //Reseta a senha com o codigo e a nova senha
  const onResetPress = async () => {
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password
      })
      alert('Password reset with success')

      //Seta a sessão como ativa, logará o usuario automaticamente
      await setActive!({session: result!.createdSessionId})
    } catch (error: any) {
      alert(error.errors[0].message)
      
    }
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !successCreated }} />

      {!successCreated && (
        <>
          <TextInput autoCapitalize="none" placeholder="simon@galaxies.dev" value={emailAddress} onChangeText={setEmailAddress} style={styles.inputField} />

          <Button onPress={onRequestReset} title="Send Reset Email" color={'#6c47ff'}></Button>
        </>
      )}

      {successCreated && (
        <>
          <View>
            <TextInput value={code} placeholder="Code..." style={styles.inputField} onChangeText={setCode} />
            <TextInput placeholder="New password" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputField} />
          </View>
          <Button onPress={onResetPress} title="Set new Password" color={'#6c47ff'}></Button>
        </>
      )}
    </View>
  )
}

export default PwdReset

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: '#6c47ff',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    margin: 8,
    alignItems: 'center',
  },
});