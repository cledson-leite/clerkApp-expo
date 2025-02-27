import { useAuth } from "@clerk/clerk-expo"
import { Ionicons } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import { Pressable } from "react-native"

export const LogoutButton = () => {
    const {signOut} = useAuth()

    const doLogout = async () => {
        signOut()
    }

    return (
        <Pressable onPress={doLogout} style={{marginRight: 10}} >
            <Ionicons name="log-out-outline" size={24} color="#fff"/>
        </Pressable>
    )
}

const TabsPage = () => {
    const {isSignedIn} = useAuth()

    return (
        <Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#6c47ff',
                },
                headerTintColor: '#fff',
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
                    tabBarLabel: 'Home',
                }}
                redirect={!isSignedIn}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'My Profile',
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
                    tabBarLabel: 'My Profile',
                    headerRight: () => <LogoutButton/>
                }}
                redirect={!isSignedIn}
            />
        </Tabs>
    )
}

export default TabsPage