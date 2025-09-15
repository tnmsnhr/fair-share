import {
  Image,
  Platform,
  SectionList,
  SectionListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { makeStyles } from "@/theme/theme";
import { Contact } from "expo-contacts";
import { useEffect, useMemo, useState } from "react";
import {
  getAllContacts,
  requestContactPermission,
  searchContacts,
} from "@/services/contacts";
import { Icon, Separator, Typo } from "@/ui-components";
import { s } from "@/theme/spacing";

type ContactSection = { title: string; data: Contact[] };

type Props = {
  UNSAFE_STYLE?: ViewStyle;
  onSelect?: (contacts: Contact[]) => void;
  selected?: Contact[];
  query?: string;
};

const ContactPicker: React.FC<Props> = ({
  UNSAFE_STYLE,
  onSelect,
  selected,
  query,
}) => {
  const [contacts, setContacts] = useState<ContactSection[]>([
    {
      title: "Recent",
      data: [
        {
          name: "Recent 1",
          contactType: "person",
          id: "1",
        },
        {
          name: "Recent 2",
          contactType: "person",
          id: "2",
        },
        {
          name: "Recent 3",
          contactType: "person",
          id: "3",
        },
        {
          name: "Recent 4",
          contactType: "person",
          id: "4",
        },
        {
          name: "Recent 5",
          contactType: "person",
          id: "5",
        },
        {
          name: "Recent 6",
          contactType: "person",
          id: "6",
        },
      ],
    },
  ]);

  const [selectedContacts, setSelectedContacts] = useState<Contact[]>();

  const s = useStyles();

  useEffect(() => {
    requestContactPermission();
    getAllContacts().then((res) => {
      setContacts((c) => [...c, { title: "Your contacts", data: res }]);
    });
    setSelectedContacts(selected);
  }, []);

  useEffect(() => {
    if (!!query) {
      searchContacts(query).then((res) => {
        setContacts([{ title: "Searched Contacts", data: res }]);
      });
    } else {
      setContacts([]);
    }
  }, [query]);

  const isSelected = (id: string): boolean => {
    return selected?.findIndex((el) => el?.id === id) >= 0;
  };

  const handleSelect = (contact: Contact, isSelected: boolean) => {
    // onSelect && onSelect(contact);
    console.log(contact, isSelected);
    let updateSelectedContacts = [...selectedContacts];
    if (isSelected) {
      updateSelectedContacts = [...updateSelectedContacts]?.filter(
        (c) => c?.id !== contact?.id
      );
      setSelectedContacts(updateSelectedContacts);
    } else {
      updateSelectedContacts = [...selectedContacts, contact];
      setSelectedContacts(updateSelectedContacts);
    }

    onSelect && onSelect(updateSelectedContacts);
  };

  const renderItem: SectionListRenderItem<Contact, ContactSection> = ({
    item,
  }) => {
    const isContactSelected = isSelected(item?.id);
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={s.contactItem}
        onPress={() => handleSelect(item, isContactSelected)}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={s.avatar}>
            <Image source={item?.image} style={{ flex: 1 }} />
          </View>
          <Typo variant="body">{item?.name}</Typo>
        </View>
        <View style={[s.checkBox, isContactSelected && s.selected]}>
          <Icon
            name="check"
            size={16}
            color={isContactSelected ? "#fff" : ""}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: { section: ContactSection }) => (
    <View style={[s.header]}>
      <Typo inline variant="bodyStrong" tone="muted" weight={"600"}>
        {section.title}
      </Typo>
    </View>
  );

  return (
    <View style={[s.container, UNSAFE_STYLE]}>
      <SectionList<Contact, ContactSection>
        sections={contacts}
        keyExtractor={(item, index) => item?.id?.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled
        initialNumToRender={30}
        maxToRenderPerBatch={30}
        updateCellsBatchingPeriod={16}
        windowSize={2}
        removeClippedSubviews={Platform.OS === "android"}
        ItemSeparatorComponent={() => <Separator margin="xs" />}
        SectionSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        // style={{ backgroundColor: "red" }}
      />
    </View>
  );
};

export default ContactPicker;

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
  },
  avatar: {
    height: s("2xl"),
    width: s("2xl"),
    borderRadius: s("2xl") / 2,
    backgroundColor: t.mutedText,
  },
  contactItem: {
    flexDirection: "row",
    gap: s("sm"),
    alignItems: "center",
    paddingVertical: s("xxs"),
    paddingHorizontal: s("md"),
    justifyContent: "space-between",
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    // Make sticky headers look correct on top of rows:
    zIndex: 1,
    backgroundColor: t.white,
  },
  checkBox: {
    height: 24,
    width: 24,
    backgroundColor: t.border,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  selected: {
    backgroundColor: t.primary,
  },
}));
