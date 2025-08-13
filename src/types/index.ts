import { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  Home: undefined;
  Styles: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList>;
  WebView: { url: string; title: string };
};

export interface HotListSource {
  name: string;
  path: string;
}

export interface HotListItem {
  title: string;
  url: string;
  hot: string;
  author: string;
  timestamp?: number;
  cover?: string;
}

export interface HotListData {
  code: number;
  message: string;
  title: string;
  name: string;
  type: string;
  total: number;
  update_time: number;
  data: HotListItem[];
}
