import { Astrologer } from "@/src/components/types/types";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ExperienceIcon from "@expo/vector-icons/MaterialCommunityIcons";
import EducationIcon from "@expo/vector-icons/Entypo";
import AgeIcon from "@expo/vector-icons/Feather";
import { astrologerImages } from "@/src/components/action-sheet/ActionSheetProvider";
import { CircleButton } from "../button/CircleButton";
import { useActionSheet } from "../action-sheet/ActionSheetApi";

interface ChatHeaderProps {
  astrologer: Astrologer;
  onBack: () => void;
  onOpenSettings: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onBack,
  astrologer,
  onOpenSettings,
}) => {
  const { showActionSheet } = useActionSheet();

  const onOpenUserProfile = () =>
    showActionSheet({
      title: astrologer.name,
      description: astrologer.title,
      actions: [
        {
          title: "21+ years of experience",
          icon: <ExperienceIcon name="atom" size={20} color="#D036FA" />,
          onPress: () => {},
        },
        {
          title: "B.A. Mathematical Honours, Hindu College",
          icon: <EducationIcon name="graduation-cap" size={24} color="#2EA200" />,
          onPress: () => {},
        },
        {
          title: "37 years old",
          icon: <AgeIcon name="user" size={24} color="#CBB0144D" />,
          onPress: () => {},
        },
      ],
      highlightIndex: 0,
    });

  return (
    <View style={styles.header}>
      <CircleButton
        size={36}
        onPress={onBack}
        borderColor="#e7e5e4"
        borderWidth={1}
        backgroundColor="#FFF"
        Icon={<Icon name="keyboard-arrow-left" size={25} color="#78716C" />}
      />

      <TouchableOpacity onPress={onOpenUserProfile} style={styles.profileInfo}>
        <Image
          source={astrologerImages["icon"]}
          style={styles.avatarImage}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{astrologer.name}</Text>
          <Text style={styles.title}>{astrologer.title}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onOpenSettings} style={styles.settingsButton}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
        <View style={styles.handleBox} />
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  profileInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nameContainer: {
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  title: {
    fontSize: 12,
    color: "#888",
  },
  settingsButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 2,
  },
  handle: {
    width: 13,
    height: 3,
    backgroundColor: "#A8A29E",
    borderRadius: 2,
  },
  handleBox: {
    width: 23,
    height: 13,
    borderWidth: 5,
    borderRadius: 5,
    borderColor: "#A8A29E",
  },
});
