// Hà Nội — Căn Gác Phố Cổ. Five quests; the letters spell HANOI.

export default {
  id: "hanoi",
  name: "Hà Nội",
  region: "Miền Bắc",
  room: "Căn Gác Phố Cổ",
  tagline: "Một căn gác vàng ô cửa xanh, nhìn ra Hồ Gươm lúc chạng vạng.",
  story:
    "Bạn tỉnh dậy trên căn gác của một ngôi nhà ống giữa 36 phố phường. Cánh cửa gỗ đã khóa bằng ổ khóa chữ, "
    + "còn người chủ nhà — một ông giáo già mê sử — để lại năm câu đố trên năm đồ vật. "
    + "Giải hết, gom đủ chữ cái, bạn sẽ biết mật mã của cánh cửa. Đồng hồ đang chạy!",
  outro: "Cánh cửa mở ra con ngõ nhỏ thơm mùi phở sáng. Phía cuối phố, Hồ Gươm đã lên đèn.",
  timeLimit: 15 * 60,
  difficulty: 1,
  map: { lon: 105.85, lat: 21.03, label: "left" },
  theme: { accent: "#e8b04a", glow: "#ffd98a" },
  final: {
    word: "HANOI",
    prompt: "Ổ khóa chữ có năm ô. Xếp các chữ cái bạn thu được thành tên một thành phố.",
  },
  quests: [
    {
      id: "scroll",
      object: "Cuộn chiếu trên tường",
      title: "Chiếu Dời Đô",
      type: "choice",
      prompt:
        "Cuộn giấy cũ chép: «…muốn đóng đô ở nơi trung tâm, mưu toan nghiệp lớn…». "
        + "Vua Lý Thái Tổ dời đô từ Hoa Lư về thành Đại La, đặt tên là Thăng Long vào năm nào?",
      options: ["938", "1010", "1070", "1428"],
      answer: 1,
      hints: [
        "Năm 2010, Hà Nội tổ chức Đại lễ kỷ niệm 1000 năm Thăng Long.",
        "Lấy 2010 trừ đi 1000.",
      ],
      reward: "N",
      fact: "Năm 1010, vua Lý Thái Tổ ban Chiếu dời đô, rời Hoa Lư về thành Đại La và đặt tên mới là Thăng Long — «rồng bay lên».",
    },
    {
      id: "shelf",
      object: "Kệ sách và bưu thiếp",
      title: "Bốn Tấm Bưu Thiếp",
      type: "order",
      prompt: "Bốn tấm bưu thiếp trên kệ sách bị xáo trộn. Xếp các công trình theo năm xây dựng, từ xưa nhất đến mới nhất.",
      items: [
        { key: "motcot", label: "Chùa Một Cột" },
        { key: "vanmieu", label: "Văn Miếu" },
        { key: "longbien", label: "Cầu Long Biên" },
        { key: "nhahat", label: "Nhà hát Lớn Hà Nội" },
      ],
      answer: ["motcot", "vanmieu", "longbien", "nhahat"],
      hints: [
        "Hai công trình có từ thời nhà Lý; hai công trình kia do người Pháp xây.",
        "Chùa Một Cột (1049) có trước Văn Miếu (1070); Cầu Long Biên (1902) xong trước Nhà hát Lớn (1911).",
      ],
      reward: "O",
      fact: "Chùa Một Cột dựng năm 1049, Văn Miếu năm 1070, Cầu Long Biên hoàn thành năm 1902 và Nhà hát Lớn khánh thành năm 1911.",
    },
    {
      id: "turtle",
      object: "Tượng rùa đồng bên cửa sổ",
      title: "Rùa Vàng Đòi Gươm",
      type: "text",
      prompt:
        "Dưới tượng rùa khắc dòng chữ: «Sau khi thắng giặc Minh, vua Lê Lợi dạo thuyền và trả gươm thần cho Rùa Vàng. "
        + "Hồ ấy từ đó mang tên gì?» Gõ tên hồ.",
      placeholder: "Tên hồ…",
      accept: ["Hoàn Kiếm", "Hồ Hoàn Kiếm", "Hồ Gươm", "Gươm", "Hoan Kiem Lake"],
      hints: [
        "Nhìn ra cửa sổ: hồ có Tháp Rùa ở giữa.",
        "«Hoàn» là trả lại, «Kiếm» là thanh gươm.",
      ],
      reward: "H",
      fact: "Hồ Lục Thủy được đổi tên thành Hồ Hoàn Kiếm — «hồ trả gươm» — gắn với truyền thuyết vua Lê Lợi trả gươm cho Rùa Vàng.",
    },
    {
      id: "steles",
      object: "Hộp gỗ khóa số",
      title: "Hộp Bia Tiến Sĩ",
      type: "code",
      prompt:
        "Hộp gỗ chạm hình bia đá đặt trên lưng rùa, khóa bằng hai vòng số. "
        + "Dòng khắc trên nắp: «Văn Miếu – Quốc Tử Giám còn lưu giữ bao nhiêu tấm bia tiến sĩ?»",
      answer: "82",
      hints: [
        "Con số nằm trong khoảng từ 80 đến 90.",
        "Là số chẵn, hai chữ số cộng lại bằng 10.",
      ],
      reward: "I",
      fact: "82 tấm bia tiến sĩ (khoa thi 1442–1779) đặt trên lưng rùa đá ở Văn Miếu, được UNESCO ghi danh là Di sản Tư liệu Thế giới.",
    },
    {
      id: "menu",
      object: "Bảng thực đơn viết phấn",
      title: "Thực Đơn Phố Cổ",
      type: "match",
      prompt: "Bảng phấn của quán ăn dưới nhà bị nhòe hết chữ. Nối mỗi món với đặc điểm của nó.",
      pairs: [
        ["Phở", "Bánh phở trong nước dùng hầm xương"],
        ["Bún chả", "Chả thịt nướng than hoa ăn cùng bún"],
        ["Cà phê trứng", "Lòng đỏ trứng đánh bông phủ trên cà phê"],
        ["Chả cá Lã Vọng", "Cá lăng rán vàng ăn với thì là"],
      ],
      hints: [
        "Món có «than hoa» là món nướng.",
        "Thì là là rau thơm đi cùng món cá.",
      ],
      reward: "A",
      fact: "Cà phê trứng ra đời năm 1946 ở quán Giảng, khi sữa tươi khan hiếm; phở, bún chả và chả cá Lã Vọng là những món làm nên ẩm thực Hà Nội.",
    },
  ],
};
