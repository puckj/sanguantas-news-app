type NewsImageProps = {
  news_image_data: string;
  news_image_id: number;
};

type NewsContentProps = {
  news_data: string;
  news_headline: string;
  news_id: number;
  news_image: NewsImageProps[] | null;
  time: string;
};

type OtherNewsCardItemProps = {
  item: {
    headlines: string;
    news_id: number;
    news_image: NewsImageProps[] | null;
    time: string;
  };
};

type UserProfileProps = {
  company_id: number;
  company_name: string;
  file_image: string;
  user_code: string;
  user_fullname: string;
  user_id: number;
  user_name: string;
};
