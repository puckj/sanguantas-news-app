type ILogin = {
  in_username: string;
  in_password: string;
};

type ILogout = {
  in_uid: string;
};

type IGenAccessToken = {
  in_uid: string;
  in_accept_code: string;
  in_refresh_code: string | null;
};

type IGetNewsFlash = {
  in_uid: string;
  in_accept_code: string;
  in_refresh_code: string;
};

type IGetNewsHeadlines = {
  in_uid: string;
  in_accept_code: string;
  in_refresh_code: string;
};

type IGetNewsContent = {
  in_uid: string;
  in_accept_code: string;
  in_refresh_code: string;
  in_news_id: number;
};

type IGetUserProfile = {
  in_uid: string;
  in_accept_code: string;
  in_refresh_code: string;
};
