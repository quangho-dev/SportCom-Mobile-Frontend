import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AppFrontScreen from "./screens/AppFrontScreen";
import SignUpScreen from "./screens/SignUpScreen";
import LogInScreen from "./screens/LogInScreen";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import tw from "twrnc";
import Toast from "react-native-toast-message";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import { useContext, useEffect, useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { store } from "./store";
import { Provider } from "react-redux";
import CreateUserProfileScreen from "./screens/CreateUserProfileScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "./screens/ProfileScreen";
import s from "./style";
import UserProfileScreen from "./screens/UserProfileScreen";
import EditUserProfileScreen from "./screens/EditUserProfileScreen";

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "white",
        headerShown: false,
      }}
    >
      <Stack.Screen name="AppFront" component={AppFrontScreen} />
      <Stack.Screen name="LogIn" component={LogInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function HomeBottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "ios-list" : "ios-list-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: s.colors.primary,
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={() => {
          return {
            headerShown: true,
          };
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthenticatedRootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeBottomTabs"
        component={HomeBottomTabs}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="CreateUserProfile"
        component={CreateUserProfileScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen name="UserProfile" component={UserProfileScreen} />

      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="EditUserProfile"
          component={EditUserProfileScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Provider store={store}>
        {!authCtx.isAuthenticated && <AuthStack />}
        {authCtx.isAuthenticated && <AuthenticatedRootStack />}
      </Provider>
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");

      if (storedToken) {
        authCtx.authenticate(storedToken);
      }

      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  if (isTryingLogin) {
    return <AppLoading />;
  }

  return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <SafeAreaView style={tw`flex-1`}>
          <Root />
          <Toast />
        </SafeAreaView>
      </AuthContextProvider>
    </>
  );
}
