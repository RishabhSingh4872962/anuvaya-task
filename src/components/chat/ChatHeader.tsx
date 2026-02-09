import { Astrologer } from "@/src/components/types/types";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import Icon from "react-native-vector-icons/MaterialIcons";
import ExperienceIcon from "@expo/vector-icons/MaterialCommunityIcons";
import EducationIcon from "@expo/vector-icons/Entypo";
import AgeIcon from "@expo/vector-icons/Feather";
import { astrologerImages } from "@/src/components/action-sheet/ActionSheetProvider";
import { CircleButton } from "../button/CircleButton";
import { useActionSheet } from "../action-sheet/ActionSheetApi";
import Handle from "../handle/Handle";

// const AVATAR_SIZE = 40;
const BUTTON_SIZE = 36;

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
          icon: (
            <ExperienceIcon
              name="atom"
              size={20}
              color={colors.iconExperience}
            />
          ),
          onPress: () => {},
        },
        {
          title: "B.A. Mathematical Honours, Hindu College",
          icon: (
            <EducationIcon
              name="graduation-cap"
              size={24}
              color={colors.iconEducation}
            />
          ),
          onPress: () => {},
        },
        {
          title: "37 years old",
          icon: <AgeIcon name="user" size={24} color={colors.iconAge} />,
          onPress: () => {},
        },
      ],
      highlightIndex: 0,
    });

  return (
    <View style={styles.header}>
      <CircleButton
        size={BUTTON_SIZE}
        onPress={onBack}
        borderColor={colors.border}
        borderWidth={1}
        backgroundColor={colors.background}
        Icon={
          <Icon name="keyboard-arrow-left" size={25} color={colors.textMuted} />
        }
      />

      <TouchableOpacity onPress={onOpenUserProfile} style={styles.profileInfo}>
        <View style={styles.avatarWrapper}>
          <Image source={astrologerImages["icon"]} style={styles.avatarImage} />
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{astrologer.name}</Text>
          <Text style={styles.title}>{astrologer.title}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onOpenSettings} style={styles.settingsButton}>
        <Handle width={13} />
        <View style={styles.handleBox} />
        <Handle width={13} />
      </TouchableOpacity>
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: spacing.lg,
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: 80,
    position: "absolute",
  },
  nameContainer: {
    marginLeft: spacing.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  title: {
    fontSize: 12,
    color: colors.timestamp,
  },
  settingsButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
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
    backgroundColor: colors.textMuted,
    borderRadius: 2,
  },
  handleBox: {
    width: 23,
    height: 13,
    borderWidth: 5,
    borderRadius: 5,
    borderColor: colors.textMuted,
  },
});
