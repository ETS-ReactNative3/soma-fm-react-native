import React, { useCallback } from "react";
import { TouchableHighlight } from "react-native";
import { TextContent } from "../molecules/TextContent";
import { useSelectChannelAndRedirect } from "../../utils";
import styled from "styled-components";

const TrackImage = styled.Image`
  width: 62px;
  height: 62px;
  margin-right: 14px;
  border-radius: 8px;
`;

const ChannelContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const AbsoluteContainer = styled.View`
  position: absolute;
  right: 16px;
  top: 0;
`;

const FavoriteIcon = styled.Image`
  width: 18px;
  height: 18px;
`;

const IconContainer = styled.View`
  width: 32px;
  height: 32px;
`;

const favoriteIconInActive = require("../../../assets/icons/favorite-inactive.png");
const favoriteIconActive = require("../../../assets/icons/favorite-active.png");

export function Channel({ channel, onFavoriteClick }) {
  const selectChannel = useSelectChannelAndRedirect(channel);

  const {
    title,
    xlimage,
    listeners,
    description,
    isFavorite,
    $: { id },
  } = channel;

  const favoriteIcon = isFavorite ? favoriteIconActive : favoriteIconInActive;

  const handleFavoritePress = useCallback(
    (event) => {
      event.preventDefault();
      onFavoriteClick(id);
    },
    [onFavoriteClick]
  );
  return (
    <TouchableHighlight onPress={selectChannel}>
      <ChannelContainer>
        <TrackImage
          source={{
            uri: xlimage[0],
          }}
        />
        <TextContent
          title={title[0]}
          listeners={listeners[0]}
          description={description[0]}
        />
        <AbsoluteContainer>
          <TouchableHighlight onPress={handleFavoritePress}>
            <IconContainer>
              <FavoriteIcon source={favoriteIcon} />
            </IconContainer>
          </TouchableHighlight>
        </AbsoluteContainer>
      </ChannelContainer>
    </TouchableHighlight>
  );
}
