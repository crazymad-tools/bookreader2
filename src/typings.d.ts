declare interface Book {
  name: string;     // 书籍名称
  origin: string;   // 书籍原文件名
  id: string;       // 书籍id
  remote: boolean;  // 是否拥有远程服务
  current: number;  // 阅读进度
}

declare interface Catalog {
  name: string;
  offset: number;
}

declare interface ReaderSettings {
  size: number,
  color: string
  background: string;
}
