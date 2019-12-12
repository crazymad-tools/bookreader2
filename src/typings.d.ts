declare interface Book {
  name: string;     // 书籍名称
  id: string;       // 书籍id
  remote: boolean;  // 是否拥有远程服务
  path: string;     // 本地路径
  current: number;  // 阅读进度
}

declare interface Catalog {
  name: string;
  offset: number;
}