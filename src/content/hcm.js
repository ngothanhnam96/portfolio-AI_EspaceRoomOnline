// TP. Hồ Chí Minh — Căn Hộ Chung Cư Cũ. Six quests; the letters spell SAIGON.

export default {
  id: "hcm",
  name: "TP. Hồ Chí Minh",
  region: "Miền Nam",
  room: "Căn Hộ Chung Cư Cũ",
  tagline: "Sàn gạch bông, ly cà phê sữa đá và cả Sài Gòn rực rỡ ngoài ban công.",
  story:
    "Bạn ghé thăm căn hộ chung cư cũ của bà ngoại ở trung tâm Sài Gòn. Bà đi chợ, và cánh cửa xếp đã bị khóa bằng "
    + "một ổ khóa chữ — trò chơi bà vẫn bày cho cháu. Sáu đồ vật trong nhà giấu sáu câu đố. "
    + "Giải xong trước khi bà về nhé!",
  outro: "Cánh cửa xếp kéo ra kèn kẹt. Dưới đường, Sài Gòn đã lên đèn, tiếng xe máy rộn ràng.",
  timeLimit: 18 * 60,
  difficulty: 2,
  map: { lon: 106.66, lat: 10.76, label: "right" },
  theme: { accent: "#ff8a5c", glow: "#ffc6a8" },
  final: {
    word: "SAIGON",
    prompt: "Ổ khóa chữ trên cửa xếp có sáu ô. Xếp các chữ cái thành cái tên thân thương của thành phố.",
  },
  quests: [
    {
      id: "binoculars",
      object: "Ống nhòm ngoài ban công",
      title: "Ống Nhòm Bên Ban Công",
      type: "code",
      prompt:
        "Qua ống nhòm, bạn thấy tòa tháp hình búp sen có sân đỗ trực thăng nhô ra. "
        + "Ổ khóa hai vòng số trên ống nhòm hỏi: «Tháp Bitexco có bao nhiêu tầng?»",
      answer: "68",
      hints: [
        "Nhiều hơn 60 tầng nhưng chưa tới 70.",
        "Chữ số sau lớn hơn chữ số trước đúng 2 đơn vị.",
      ],
      reward: "S",
      fact: "Tháp tài chính Bitexco cao 68 tầng (262 m), lấy cảm hứng từ búp sen, có sân đỗ trực thăng nhô ra ở tầng 52.",
    },
    {
      id: "radio",
      object: "Chiếc radio cũ",
      title: "Chiếc Radio Cũ",
      type: "choice",
      prompt:
        "Chiếc radio rè rè đọc bản tin: «…Kể từ hôm nay, Sài Gòn – Gia Định chính thức mang tên Thành phố Hồ Chí Minh…». "
        + "Bản tin ấy phát vào năm nào?",
      options: ["1945", "1975", "1976", "1986"],
      answer: 2,
      hints: [
        "Không phải năm thống nhất đất nước, mà một năm sau đó.",
        "Ngày 2 tháng 7 của năm này.",
      ],
      reward: "A",
      fact: "Ngày 2/7/1976, Quốc hội nước Việt Nam thống nhất chính thức đặt tên Thành phố Hồ Chí Minh.",
    },
    {
      id: "corkboard",
      object: "Bảng ghim bưu thiếp",
      title: "Bảng Ghim Bưu Thiếp",
      type: "order",
      prompt: "Bốn tấm bưu thiếp ghim trên bảng gỗ bần. Xếp các công trình theo năm hoàn thành, từ xưa đến nay.",
      items: [
        { key: "ducba", label: "Nhà thờ Đức Bà" },
        { key: "buudien", label: "Bưu điện Thành phố" },
        { key: "benthanh", label: "Chợ Bến Thành" },
        { key: "landmark", label: "Landmark 81" },
      ],
      answer: ["ducba", "buudien", "benthanh", "landmark"],
      hints: [
        "Landmark 81 hoàn thành năm 2018 — chắc chắn đứng cuối.",
        "Nhà thờ Đức Bà (1880) xong trước Bưu điện (1891).",
      ],
      reward: "I",
      fact: "Nhà thờ Đức Bà (1880), Bưu điện Thành phố (1891), Chợ Bến Thành (1914) và Landmark 81 (2018) — tòa nhà cao nhất Việt Nam.",
    },
    {
      id: "coffee",
      object: "Ly cà phê trên bàn",
      title: "Ly Cà Phê Buổi Sáng",
      type: "text",
      prompt: "Mảnh giấy kẹp dưới ly viết: «Thân tôi có lỗ mà chẳng thủng, mỗi sáng nhỏ từng giọt nâu cho người Sài Gòn. Tôi là gì?»",
      placeholder: "Câu trả lời…",
      accept: ["phin", "cái phin", "phin cà phê", "phin cafe"],
      hints: [
        "Nhìn chiếc cốc nhôm nhỏ đặt trên miệng ly.",
        "Từ có 4 chữ cái, gốc từ tiếng Pháp «filtre».",
      ],
      reward: "G",
      fact: "Chiếc phin nhôm nhỏ giọt là linh hồn của ly cà phê sữa đá Sài Gòn.",
    },
    {
      id: "cart",
      object: "Ảnh xe đẩy ăn đêm",
      title: "Xe Đẩy Ăn Đêm",
      type: "match",
      prompt: "Tấm ảnh xe đẩy ăn đêm có bốn món, nhưng nhãn đã bong. Nối món với mô tả.",
      pairs: [
        ["Cơm tấm", "Hạt gạo tấm ăn với sườn nướng"],
        ["Bánh mì", "Ổ bánh giòn kẹp pa-tê, chả lụa"],
        ["Hủ tiếu Nam Vang", "Sợi hủ tiếu với nước dùng xương ngọt"],
        ["Bánh xèo", "Vỏ bánh vàng giòn đổ trong chảo"],
      ],
      hints: [
        "«Tấm» là hạt gạo vỡ.",
        "Món kêu «xèo» khi đổ bột vào chảo nóng.",
      ],
      reward: "O",
      fact: "Cơm tấm, bánh mì, hủ tiếu và bánh xèo — bốn món ăn đường phố làm nên «vị Sài Gòn».",
    },
    {
      id: "map",
      object: "Bản đồ du lịch trên tường",
      title: "Tấm Bản Đồ Du Lịch",
      type: "multi",
      prompt:
        "Tấm bản đồ đánh dấu nhiều công trình, nhưng vài cái ghim cắm nhầm thành phố. "
        + "Chọn tất cả những công trình thật sự nằm ở TP. Hồ Chí Minh.",
      options: ["Dinh Độc Lập", "Chùa Một Cột", "Chợ Bến Thành", "Cầu Rồng", "Nhà hát Thành phố", "Văn Miếu", "Địa đạo Củ Chi"],
      answers: [0, 2, 4, 6],
      hints: [
        "Có ba cái ghim cắm nhầm: hai của Hà Nội, một của Đà Nẵng.",
        "Cầu Rồng ở Đà Nẵng; Chùa Một Cột và Văn Miếu ở Hà Nội.",
      ],
      reward: "N",
      fact: "Dinh Độc Lập, Chợ Bến Thành, Nhà hát Thành phố và Địa đạo Củ Chi đều thuộc TP. Hồ Chí Minh.",
    },
  ],
};
