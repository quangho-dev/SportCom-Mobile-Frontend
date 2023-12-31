import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AppFrontScreen from "./screens/AppFrontScreen";
import SignUpScreen from "./screens/SignUpScreen";
import LogInScreen from "./screens/LogInScreen";
import { SafeAreaView, StatusBar } from "react-native";
import tw from "twrnc";
import Toast from "react-native-toast-message";
import { useEffect } from "react";
import HomeScreen from "./screens/HomeScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { store } from "./store";
import { Provider, useDispatch, useSelector } from "react-redux";
import CreateUserProfileScreen from "./screens/CreateUserProfileScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import s from "./style";
import UserProfileScreen from "./screens/UserProfileScreen";
import EditUserProfileScreen from "./screens/EditUserProfileScreen";
import TeamScreen from "./screens/TeamScreen";
import CreateTeamScreen from "./screens/CreateTeamScreen";
import LoadingOverlay from "./components/ui/LoadingOverlay";
import { getUserProfile } from "./features/userProfile/userProfileSlice";
import { getCurrentUser } from "./features/user/userSlice";
import { addToken } from "./features/auth/authSlice";
import CreateMeeting from "./components/CreateMeeting";
import {
  DrawerToggleButton,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import SearchMeetingsScreenV2 from "./screens/SearchMeetingsScreenV2";
import MeetingDetails from "./components/MeetingDetails";
import MeetingsBelongToUserScreen from "./screens/MeetingsBelongToUserScreen";
import EditMeetingScreen from "./screens/EditMeetingScreen";

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator();

const MeetingDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Meetings"
      screenOptions={{
        drawerPosition: "right",
        headerLeft: false,
        headerRight: () => <DrawerToggleButton />,
      }}
    >
      <Drawer.Screen
        name="Meetings"
        component={SearchMeetingsScreenV2}
        options={() => {
          return {
            headerShown: true,
            title: "Các buổi chơi",
            drawerIcon: ({ focused, size }) => (
              <MaterialCommunityIcons
                name="badminton"
                size={size}
                color={s.colors.primary}
              />
            ),
          };
        }}
      />

      <Drawer.Screen
        name="CreateMeeting"
        component={CreateMeeting}
        options={() => {
          return {
            headerShown: true,
            title: "Tạo buổi chơi",
            drawerIcon: ({ focused, size }) => (
              <Ionicons name="add" size={size} color={s.colors.primary} />
            ),
          };
        }}
      />

      <Drawer.Screen
        name="MeetingsBelongToUser"
        component={MeetingsBelongToUserScreen}
        options={() => {
          return {
            headerShown: true,
            title: "Các buổi chơi của bạn",
            drawerIcon: ({ focused, size }) => (
              <Ionicons name="folder" size={size} color={s.colors.primary} />
            ),
          };
        }}
      />
    </Drawer.Navigator>
  );
};

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
          let icon;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Team") {
            iconName = "team";
            icon = <AntDesign name={iconName} size={size} color={color} />;
            return icon;
          } else if (route.name === "Profile") {
            iconName = focused ? "ios-list" : "ios-list-outline";
          } else if (route.name === "MeetingDrawer") {
            iconName = "badminton";
            icon = (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
            return icon;
          }
          // You can return any component that you like here!
          icon = <Ionicons name={iconName} size={size} color={color} />;

          return icon;
        },
        headerShown: false,
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
            tabBarLabel: "Trang chính",
          };
        }}
      />

      <Tab.Screen
        name="MeetingDrawer"
        component={MeetingDrawer}
        options={() => {
          return {
            tabBarLabel: "Buổi chơi",
          };
        }}
      />

      {/* <Tab.Screen
        name="Team"
        component={TeamScreen}
        options={() => {
          return {
            headerShown: true,
            title: "Câu lạc bộ",
          };
        }}
      /> */}
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
        name="MeetingDetails"
        component={MeetingDetails}
        options={{
          headerShown: true,
          title: "Chi tiết buổi chơi",
        }}
      />

      <Stack.Screen
        name="EditMeeting"
        component={EditMeetingScreen}
        options={{
          headerShown: true,
          title: "Chỉnh sửa buổi chơi",
        }}
      />

      <Stack.Screen
        name="CreateUserProfile"
        component={CreateUserProfileScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="CreateMeeting"
        component={CreateMeeting}
        options={{
          headerShown: true,
          title: "Tạo buổi chơi",
        }}
      />

      <Stack.Screen
        name="SearchMeetingsHome"
        component={SearchMeetingsScreenV2}
        options={{
          headerShown: true,
          title: "Tìm các buổi chơi",
        }}
      />

      <Stack.Screen
        name="CreateTeam"
        component={CreateTeamScreen}
        options={{
          headerShown: true,
          title: "Tạo câu lạc bộ",
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

export function App() {
  const { token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addToken());

    if (token) {
      dispatch(getCurrentUser(token));
      dispatch(getUserProfile(token));
    }
  }, [token, getCurrentUser, getUserProfile]);

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <SafeAreaView style={tw`flex-1`}>
          {token ? <AuthenticatedRootStack /> : <AuthStack />}
          <Toast />
        </SafeAreaView>
      </NavigationContainer>
    </>
  );
}

export default () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
