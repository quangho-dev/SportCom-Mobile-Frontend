import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppFrontScreen from "./screens/AppFrontScreen";
import SignUpScreen from "./screens/SignUpScreen";
import LogInScreen from "./screens/LogInScreen";
import { SafeAreaView, StatusBar } from "react-native";
import tw from "twrnc";
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar />
      <SafeAreaView style={tw`flex-1`}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              options={{ headerShown: false }}
              name="AppFrontScreen"
              component={AppFrontScreen}
            />

            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{
                title: "Đăng ký",
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="LogIn"
              component={LogInScreen}
              options={{
                title: "Đăng nhập",
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </SafeAreaView>
    </>
  );
}
