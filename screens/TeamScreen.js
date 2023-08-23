import { Button, Text, View } from "react-native";
import React, { Component, useContext, useEffect } from "react";
import tw from "twrnc";
import { getTeams } from "../features/team/teamSlice";
import { AuthContext } from "../store/auth-context";
import { useDispatch, useSelector } from "react-redux";
import Team from "../components/Team";
import s from "../style";
import AntDesign from "react-native-vector-icons/AntDesign";

const TeamScreen = ({ navigation }) => {
  const authCtx = useContext(AuthContext);

  const { teams } = useSelector((store) => store.team);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTeams(authCtx.token));
  }, []);

  return (
    <View style={tw`p-3`}>
      <Text style={tw`text-base`}>Câu lạc bộ của bạn:</Text>

      <View style={tw`mb-2`}>
        {teams.length === 0 ? (
          <Text>Bạn chưa tạo câu lạc bộ nào.</Text>
        ) : (
          teams.map((team) => <Team key={team.id} team={team} />)
        )}
      </View>

      <Button
        title="Tạo câu lạc bộ"
        color={s.colors.primary}
        onPress={() => {
          navigation.navigate("CreateTeam");
        }}
      />
    </View>
  );
};

export default TeamScreen;
