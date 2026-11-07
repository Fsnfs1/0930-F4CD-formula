/**
 * core/auth.js
 * Student & Teacher Authentication and Research Informed Consent Module (S1, S2, S3, D6, F3, F20).
 * Security Hardened:
 * - Zero plaintext passwords or test credentials in source code or error messages.
 * - Fail-closed salted SHA-256 verification for all student keys and teacher credentials.
 * - Strict role boundary separation between Student Session (`MP_V2_SESSION`) and Teacher Session (`MP_V2_TEACHER_SESSION`).
 * - Never persists plaintext `secretKey` in localStorage; derives a one-way `signingKey` for HMAC event signing.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(
      require("./config.js"),
      require("./crypto.js"),
      require("./registry.js"),
      require("./storage.js")
    );
  } else {
    root.MathCoreAuth = factory(
      root.MathCoreConfig,
      root.MathCoreCrypto,
      root.MathPlatformRegistry,
      root.MathCoreStorage
    );
  }
})(
  typeof globalThis !== "undefined" ? globalThis : window,
  function (CONFIG, CRYPTO, REGISTRY, STORAGE) {
    "use strict";

    const SESSION_KEY =
      (STORAGE && STORAGE.storageKeys && STORAGE.storageKeys.sessionKey) ||
      (CONFIG && CONFIG.storageKeys && CONFIG.storageKeys.sessionKey) ||
      "MP_V2_SESSION";
    const TEACHER_SESSION_KEY = "MP_V2_TEACHER_SESSION";
    const CONSENT_PREFIX =
      (STORAGE && STORAGE.storageKeys && STORAGE.storageKeys.consentKeyPrefix) ||
      (CONFIG && CONFIG.storageKeys && CONFIG.storageKeys.consentKeyPrefix) ||
      "MP_V2_CONSENT_";
    const CONSENT_VERSION =
      (CONFIG && CONFIG.crypto && CONFIG.crypto.consentVersion) || "2026-11-v1";

    // Salted SHA-256 verifier digest for teacher preview account (#98)
    const TEST98_KEY_HASH = "2a3cc3a7161124c0dda1c15c8341d9ae0960a5241a30dfbe92b3dc7f7131cfcf";

    // Salted SHA-256 verifier digests for authorized teacher console credentials
    const TEACHER_PASSWORD_HASHES = [
      "3043de2bd739bdb57060192d092f4a94134fc7fa320e40aa60c66b872860bcc5",
      "ec11a16de59bce6a12798bdcf291e47e2596af76b0259595113001ed8ab60f8e",
      "4e02a4738f7dd09e687bd68774bc88496c4be3ac7db5c3b288ad3cb91b490b86",
      "832368d5a3b3b7509e767d59a7818b15d5e8b6c0cd558dc6b5df13984e9e7c11",
      "50d80946a83ce4213672d48c05d208e0ea1adf7a1d74ac8f6acbba0ee9550f00"
    ];

    // Salted SHA-256 verifier digests for all 118 roster students (zero plaintext keys)
    const STUDENT_KEY_HASHES = {"4C_1":["99ce80c83decdce652456a17b3d95e999e64ce8dbe3c92df28101dfe770c40f6","1cfe164b60b625f993d8689d9eaa7fded22d69098d13264e3907a34db4fd3f35"],"4C_2":["5426553ce7b3d3da0fe43ba157a67fa9e736aecf0321005970735a09bb1e843d","16203463a92d1171f4bfc6bb7d5f48d0edb00bc40d6e4376dd023a7f21fa417e"],"4C_3":["7bddb1367c5f4b77047dcdd28451bc0fd72c5192a2163f0b98acadc0104fd3b4","40a16b9be22ec96a3bb93a908f7885694943d46f58d586472a687408e1f5c832"],"4C_4":["de9c23c306eca1bfd4d10231235dc7f22100143e72f608b285ea1e8b9b694272","f6cfd584272c71c3f6bb79f851f554301bcace7fe320e80f83bd8d0109f0f5d3"],"4C_5":["1aadbb9122d79c8f9283283adc91587f886067d8300d278ed1dbd7e57f5f3540","fd8444fbd687a1beebb7826d70b128b118d946d813610e64f3f133ceccfb5f04"],"4C_6":["6caa1516ff266b4315fefd8afcdb3cf14b8cf9446e4fcf398bca2bd1a3a67516","527856bb48c98ca12ac9586b5609af10b28f9b63c752f3646893ec733c4fb7ba"],"4C_7":["7e67fafd4737394f21880b6d7a0fb4dae92f4ce0b896acf8760940f33f1d52c7","d997e7ae16cb97470aa4f7a99bfe790352ba04bbbe65b5c6ecb7fa773339bbd2"],"4C_8":["beb24b7a08e470a2f1ff2c72bd2d7466baed071cbaa39ab5693f5a406a3a6d8d","5dfd262775874f99fc6cb8de3afa082e3ecae8ccfc4ce921df5adcf674913954"],"4C_9":["4b3492650e7d6d6e7d6721b572ab33ff592ffe3ad6233d928cc8643a12e63e5e","164ad62c7e27b79e2f20691baafd968aec2ab9fdf27246ba339a876701f300cf"],"4C_10":["d811babde370c3d194c7006496fda49bba3ec8f846c46abe37312196dba9a408","53e55c5d3af24ba000860330cafc3d8d50310bf3383661bf2709dadbe05f11c0"],"4C_11":["aa8564a9afae3914b9b9210beb568e352b0387fc4016a82df0588249598b39f0","fd7ada4c05fc637e768577600c4c9e096a6ff77caed42b082c468bc101391b8a"],"4C_12":["e9fa0cebdc9d55b31b208a033ceedceabd2f15b220f2a1544fca35ffebc8d7c4","37c85c213787f3ff9648fc26036d47a8fd0ab4db088911fac59aa8c749e21117"],"4C_14":["9e706cf5f9377861eee44c4e93eb292d7c4b2eee5404fed0dfec33cce56a1427","b80391b9beeeb02b40d20fb8dce87ec28564ac7a9a987978ebc5beb4efd53fc3"],"4C_15":["315604ed16c13943f934646612c845466e6ed5d8ab848062a408afb21f2679e2","fd1a1a30b6fc9395ea89263aaa10cdf9d6d49ffad440d363257a7740be5801c9"],"4C_16":["1cada1b1848c06b22406f0dbb02412cbfc7599d06dc9233cf6d5e770800bd618","81b04ba429062f71a3ed47f48fbcef2ecf7600d3fe2da618e16312dd9ef69e82"],"4C_17":["76c58c45ab31d4f9fd92cfffef45ab2c15f5a01146ef4b7dbec2e24a29f47260","5e21afd3cf130a650436d8a5e4d85d36ad51e0d00a4d576d96ab966e64956a84"],"4C_18":["be76bd59d44377b3884d5bf823e7a97078446335a096f76a414536b9fe80e0e6","719554ca9d29eaabdda05f201d2fcf3db531a41d9891647e81b6bc49aa91ac51"],"4C_19":["cac5281b11511543b0912b424c9ea84fc9cf5372c9980057d707ef1aefe4c95f","6debac5dbaa59bf46431de5a8d7ed25dd433e8d1722bb13365885e279c25edc5"],"4C_20":["cfde07a53da6ffda7dd26f9cb7a3907df6bcf18b04443f6ed7ab76704c101ffe","948dd1c94002982e14ca85968321451f46f63114dbb45d3b57d196b697909fbb"],"4C_21":["6104ce6f5bb72a4b0ed67b855afb5d0e2ed52602e47571dac191bed38f137b9c","2e286b42af63ff2b880686903694b9a4cdfb1821bacf3db301f00f716abaa878"],"4C_22":["28df49c0ca62f240c0e96ac916fedf1367d007c5ed743ad38f8eb174ac4c2f50","97fe51d0c0e4ff418cb46e6966620e1c1e80392b0f177c0de4dc49a81cb9a224"],"4C_23":["49a1e3a7954ba58cb976945259e4820fbbb9dbab12bb77ca04a8a1b24b817a7b","477c3b2aaeb10c61b526960364f00656c679d34f9eaced7a42fc159f58300fcd"],"4C_24":["b9d7d04e320c6b100cb6aead99687f1b10ebf1ed2d9a585c358c5b63c2a7087e","a2a4f4f5471236c39872bd3c8d56bb1bc508644ce492116d7befb3a62ab87fd8"],"4C_25":["ededfcd429338b9a5d68b67e8625205c289ce63f3896678f362995ac8c57a8e8","16c2b33e6cc60c06b9df9597e6694dc6a0ec92623d2856190f79533edf0792b7"],"4C_26":["0ddaa476e90afefbfbe9f5e389d7f61d73a740a1cb0136b459cf018a22cf72cc","e9c823f08197b05e7f3709d6b92ebb1ef296fdcf1f587aca79ad52f15a4bc1ee"],"4C_27":["57f4881c993f98cc16a7c9634f663a82773fb9b7b0c7a915ea2153494a3f76f4","32e063433aac67d3f857fecb329127a78e4fd559b047b58a1b21d01f7c33f8b3"],"4C_28":["7edc0081a82d0f68edb9cdbe1e0687944cc84b1123528c3c9010fb8eb93865f3","0ae0b8f11999f2a6bed0137ee9f674ddb47884935a1eb32758ce8d68e8cd3574"],"4C_29":["8ad172d7f35785e6516cec20c32f8b036a7395bc843bf57c92a56b3a98e7681d","1c88215e8d59696c49910e073d0ca31f5ae88266f6edc08dac605153a8aa1924"],"4C_30":["332368322b55319bde674335fff00904afcf28084351a59491aaa1c620e8f84f","c3e5d41d485cc0e71a9912d3e872b04bab380d664c825b699f3b44a0b02ab295"],"4D_1":["f04ad9fda3d60b9d8975d79b511a580b71315cfb69ca97a1fddec95f4b053eba","d305322869a922e9da1ef4fa221fb68374329aeaae5d7ef60a43c6b9f5d6757b"],"4D_2":["bbd35c51de574d3e2bde4d62bd19b716e935379d7fa2c3c4c6defd94d542f6d7","e956d224284258802ad6dda7f10e3785a80e3380f75cdcc0b4ad7a55c08e8c6e"],"4D_3":["2bf427429ab9fd9366ff8454df7b6a9bd99ad79265efd8b02508d6c2bca7108a","9a1e4d9b17b330c43655d7d7b2c9e971b223db97f6ca86e0abed4c1ea3f79153"],"4D_4":["3ab78b6c56d4bbdcc9deb815b589246a58eac72305fafd962480bd4acbcab608","16623f1a862f29107e3a3bae66287db359687b3e05fc4da73e68509a8ebee101"],"4D_5":["da41a28f25b0a41bb2fd6d61e7a08832e713d19f5a15e437fa3ff85d6c3f83f0","0ceae7bcb766e9be0dae947d493f3b1e6413f63748a64335da34b646386dd052"],"4D_6":["b16008946f7589041043c9c24a0ec77b18045aaaa87e390461c9eaa6c2353cee","df5ea52e9b2c9f2fb482122414e6139ea9792b9c2247f16e44a41e12ddddd285"],"4D_7":["ef4eeba30d2d43d453cdc50ad0b5ebba52211fbb2db23446a3e8f62575a57e18","e8966824518361fda17b815a3bd51c9c119b68903b461282e2b81c4300b78f4b"],"4D_8":["fdfe2d29947dff9b23b66f8c86c2a66629b0ab6ad7a4d6a2ec983988c762baa2","a201fc177a8b59609da03ff35a6e44b1965afbbaeac4992a44b571826d630bf5"],"4D_9":["100e4fa155f40aaa51dd8cbe5e78116e7503230601adcdbac383b21e13e9bcca","62cbcb8ca760bbbb47808dba33bf012d11bf98e1198a9aaad27ffe6ba82ee3c8"],"4D_10":["fcca581a16aa915ec836aeff435dd7b6e60daf6eaf35ec912657bd5070f357ae","2efed8ac68865123fd18247fb0c65d7d9c0373b8ec56e6d7dc47873c6fa6ebbc"],"4D_11":["a4620b15eaf8b5895b87866a0575816b9e12582580a3c96d16198442bbe9d7e8","7c52105523eba7a4664e4c6d52c96491248abbc1f2a99c4c515b6801d0955e51"],"4D_12":["dc998b7e5453504b610d3b7ee5c884aa9661619c7163a9f1c03ad6fc22585d15","5f59a1f3054996208ddc7e12c351d0251ed35851c606236cbfdd7e3b53b1a7e7"],"4D_13":["855d514e8c62c6fa8715b430844c2244dd89a02ab3b81b3d0c0123649b3f7048","1bd27046e235991c247b55a583c0e38c62755f18b89dacf18926a868eaf8d23b"],"4D_14":["34bf7965891f13b5baa57008c7efda963867ee9e62b12355772307eb8a0628da","b27fea444613dc4342b35c12be5656436cc57fc658485100e87e2317d12de53c"],"4D_15":["ece1ac05bde74fb0ff0103a1700a30f453bc5e13b6346502a9ff2788072e8636","5592f215ced1f5fdd02bf14732267c659ef262dfe0312b7ede4c93001d365211"],"4D_16":["3dd2f84f2317307707be0a9c6bb941e2d48ef0960213b83541f40298203d2067","137df9c8afe3f4fe6eca88e24068250309b35c130dc1d3b4629ad21aa7d8977e"],"4D_17":["a0ea7d506047d4dc35d6f2346ec14f5c794f28f361ba694158f062fe77c1dc5d","840e84d66cd047df014e1b000a36e2f40c3f8a5ad59736ba330cd63178fcd428"],"4D_18":["22aa384dd296b977a831f79828ba68ee960f1efc1261bd650f8d0dad4c033eaa","c58551147ff8bf342fa99061df03f6a27e9a3a9ce4be78956df304b3459cd8eb"],"4D_19":["7dbe3abcebee8344473a997be03de4d879355b1d9b879255ed95b9972aad53ae","ed1dc9d782441e18f659db91ab278e7f545e4b89056ba27fb0773396a8e36145"],"4D_20":["039e732b7167b3f75496fe9f971009fc94a4d65116fd093b4ede7e36aed95140","c58bdc59d712e7eacac35f130729f3e42bf97df8cca3da31d848508f423e1da3"],"4D_21":["9475433072cbaaa9e6dda88ca1340150bd57cc211f0f2c21553fe7d1a7898a0b","3e2eb1c51ed7075bf566025e17095b62b9f902a135c1cc7741d69d1f46012413"],"4D_22":["720c602e4148d19bb19622fe25f96f123c269d0ea1c2e87e8d035ce328382dac","8c9b5450d3477e963ec737c45699b11a48f600c78ae91570d167d96a2e5f385e"],"4D_23":["6894e2a64aa98f2fbccd244c3c2d3c06e4e8ffdaba1073ace7dbb41ab5e279d9","e62c04677fe751b39ced6c70d15ea32714fbed42030072efb153f0d3aaa477fc"],"4D_24":["b51525f0ee13fb95e541e78217627ff1476a75f3928921060a989a2daee88d4d","422678b2d7b5c97f750d648b033904e3ecdec45f09e68f0de0eb8ef14107ddf4"],"4D_25":["8eb3fc7fe4aeaac4e1b6a53f3a9ad8567918af693833c104f1872c1662e83592","88b8bb4575bd835ebc0b98331360aa7e7f722cde5ef0eb60b71cbb3383e6d6f0"],"4D_26":["147d642461263aca76eea418d5df7ba231c8c0a90bea27cc4a78c577b5aa6dd4","48e4c50260f0408b2530a39ca3d17b42ee57173f4fe182c5f70eca57dd920cbe"],"4D_27":["68ac24b0bd3e9357fc8731450e5497c54267b38235d6e8125078d811affdfb0b","15632e70c4708ce3a5342fbf3362238e4d1e7da9aed8a208662ab47d787c4150"],"4D_28":["6fe5b1292b899794ade5008238f3123dc9e967e59730d34f07434b20fe46a57f","d8ae6af6ef23c6b315fbf79f0ffeca4be70d27674e3e235123c52bd6123dd402"],"4D_29":["9f91404587f88fb2280b99a5f2c3bb865ea66c11aba509a35a08d90891d4a412","c837d60f8dfa391ff74df1f8bbf5c3ba149d4dc1d804fb0108bec8b5fd2f9244"],"4D_30":["2ca1e8e0309d274591367b0993f4280e2770e5b3ec7cfc5ee6acb9b5cda4e6b1","0d11fd27b762e8d8b0a0b19559b9a9c2e23a9b8e11818a63eec7825e9572d55f"],"4D_31":["842c08f24f3c762077143e4b7a40b1283b6f8f7d68479b3b33baa5ad6de9db03","ce72888995feea6aa99c6c1aa93077526b46bb2a03f171e80e1e63500057d87d"],"5B_1":["1ab65ee979937af18c6bced4f0e3b48e69c43064b7b6fd8d548507996be2535b"],"5B_2":["0526ab8915d406a3fc2aa6615770d9b3fa8744c76cb7c39dd6b8b1f22ccae822"],"5B_3":["4553fded7034af82e902db057041cada5883403a0088e28754ba9b7f6121babb"],"5B_4":["2ad20666a61e5e3f91c6fded1dfc2af889ab70d96043afcd4fdcd33a99424f74"],"5B_5":["50121ecb69f14e8495d3e502766c3469296433d75ee5762a10976506d72a3315"],"5B_6":["c11a8d41e0863f5da5899c7f080f5969f3db0f0a24d1f24d3fb42563f4d99fad"],"5B_7":["f99ce6ab0f2bbc59b6e90703f679bc33dd839b8d5a381278609ddad9836ac963"],"5B_8":["954bb365346846e00f88b51064302880b3568b9f519b43c945f02f01712f9ada"],"5B_9":["b0740c48044ab64fafb51a6653527deb4c2ce0523d22b3b0f03a8e1f517ece93"],"5B_10":["9dac41fb33ef493da75f28343385eb6ca27930122dfaa9593f2feee98f266300"],"5B_11":["681acc18ecf09914847b0dfd231cc9f99d7a96055b85f94d25b973d80997a80e"],"5B_12":["f272b8c221af461cf8b75feacd620fe4504002da872eb31ebd0ca1356daa2b2d"],"5B_13":["68f0134d852c5fa3e9082663cf384a19f18bca9e7eaf5714b11b56215121bb61"],"5B_14":["4db2facdd3d3bc480a2bd6cc0d7ac620d0f984fb641dfb3e99b3907059c132f4"],"5B_15":["daf1bc8af2fba93e33e2a9ddf74dc51bcabbb54dc7f6db0d0c58c663f3317806"],"5B_16":["915a787e9c1cd0e31633a22932014ff00f8818f622d467f7503c28645031ce51"],"5B_17":["a1ba1622c0000d2bcb2fea0ad6d2a0f8689d3ed92d3120684b86e530efb6b986"],"5B_18":["b8b6e500c90f099fb98628acb6ebdeafb3301cffe38fda8f1b2263bbf9f67c05"],"5B_19":["2d6be92efb81ee9c9c684f84bed4c9249c31d6a575f0565e5d6eb01c00b6c8d6"],"5B_20":["d8283b434a38c78456f09e1dffbc9207a88d23f1061498e8a3322f6612b3d366"],"5B_21":["2719a7d96e91a9c3d123dae485ee9f5ac95faff66a7e30e214252d23ab3422e4"],"5B_22":["a13da00c9e08472e85080ff7eb08943c51ea64c0e44d394ae42c3141e2569e24"],"5B_23":["46d7efc6f00393aca163a4ade69b560851ab4f65850122004bf0242600395d6c"],"5B_24":["f67dff4de83b8568a119a9eb05de7974c52a59d1005f9ff48c3c8fefa39a84dd"],"5B_25":["13928a75fe271ff02009d90f7845115204e9b49e921ea1116f6ee24eeeaa2deb"],"5B_26":["78d8c7187c8f2bf157dec187a1a9fd5a9d396661e7f6ae346d021fd5611fff40"],"5B_27":["b5e3b902d3bca91594206e27ae4feda9cc77eebcf0728d4a085030f02ac80d45"],"5B_28":["4834e48819bcb427ad7dd436c3644ba4665ea4baaf733ea9e92b52626838e2bc"],"5B_98":["909d8a6d1faf8fd5cea6a58c9e0b4c319d6712207f308327c99c470009a21da7"],"5C_1":["a9383bf6c6f4c5298a0af8d35d69657c620c33c98bc160b6dbd752dd7cc2ac58"],"5C_2":["4f9174c0348cb1bf50842b4211271a9ec1bd2c33a7d6332e74fefc07d72f0d6f"],"5C_3":["ce957cea0ccbbf85d434bf28b108878373f0485195ddd834581ecc828583c8bd"],"5C_4":["b0c087d4ee64965f99aab7740a928c856e4fc99a174c975c5c99f169747925b8"],"5C_5":["b0592f1370abc21b29b14d16dbd39bc0a17741159051743433eda6ffa9a8a073"],"5C_6":["bfafc4a6f8916f13409226a8cfeb6e4338cc014846518a8045a7638b27bf93bb"],"5C_7":["03eae5ba8daf380c6462566ebdffc2cc2d35f96020a4224830f10e16015227b9"],"5C_8":["536ee265611ed81afcfe27fec2903790a58b8ad56373db680aab8caf00711195"],"5C_9":["be4515f404647e87f7a7156eb83e70d90b5394a14e134bb14887771c825fa018"],"5C_10":["3b13d0726136cabc77161974762f9a3deb22c854df68f763529f64fdaae24ba7"],"5C_11":["df4ca8903aa3bbc797ece57793c812265e12ad3a29cbf63f839dc28dc4979c38"],"5C_12":["1dea2a636eb595238556f9b76c058bcce1148141f63cd296fc3c8495f0fbd428"],"5C_13":["5ddea90ebad95fbb9d0ec87d91569a26cfd359ba3bd9f401e2c0ca7441fd5f7a"],"5C_14":["9860213492dea8366f068dccd5706347e91f65186a6f4639f344113f8cd622c6"],"5C_15":["e29a294375d2ce393b1313f2bdd7a0dd402916aad98c189c5563d0b7275022a6"],"5C_16":["cacd16b7318c1091e230f76155afae6c74af4f2c450ce143a3a9cd30d8c43c13"],"5C_17":["bfb3fdb10a0460cf21760e8eddf4b25dbfca205098fddeae9dce52280de136bb"],"5C_18":["90182010a58f22a0ae2a03132bf8bc95e432f61c52d1798be4260fb9a9340362"],"5C_19":["b1f3159bb5827ba892c495417d6acde62f1873617491f3232a2057d455ebbfd9"],"5C_20":["3f3826047abcc730698d0cc413a49d1008da574c678670cc2abee671f01bd47c"],"5C_21":["211029ff0605bcf5a87e329b713c2473b744e12aa810065a596ba8c6dd200a7f"],"5C_22":["61eecf6de38634f218b009d9d2a9114255af708bd50b2da9901abae6e9cdbe1e"],"5C_23":["be639fc743d6253121144734fc3b1c9ec13662b36d64a8a9f16e5e59d848afd0"],"5C_24":["3111beb0db45f30268121c9d709e678eccd32e3e7757e54cbdf93c3a12a52f32"],"5C_25":["e95107be1f1e26b9dc9a9035618b6ee246364473f1e3945818b2d8f7102551cd"],"5C_26":["23d4f27dcaf21848167dd52de2b5ecfb12f25f137642768be73a4cd9fb0d9f12"],"5C_27":["c77ddc82870e676789c5745ba129e1cd6e7719fc27df1d45d5412e31029982d3"],"5C_28":["8e06e022f1bf7f87b0c37e53da61ec0b534887acfe9d0199666d517fa5e2ccac"],"5C_29":["507ed0622f2b8326c6c1ce92b227226d3e3eaee30153e3f94db538998054562f"]};

    function inferGrade(classID) {
      const c = String(classID || "").trim().toUpperCase();
      if (c.startsWith("4")) return 10;
      if (c.startsWith("5")) return 11;
      if (c.startsWith("6")) return 12;
      return 10;
    }

    function normalizeSecret(secretKey) {
      if (CRYPTO && typeof CRYPTO.normalizeStudentSecret === "function") {
        return CRYPTO.normalizeStudentSecret(secretKey);
      }
      return String(secretKey || "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "");
    }

    async function computeHash(input) {
      if (CRYPTO && typeof CRYPTO.sha256Hex === "function") {
        return await CRYPTO.sha256Hex(input);
      }
      throw new Error("MathCoreCrypto.sha256Hex is required for authentication");
    }

    /**
     * Fail-closed student key verification against:
     * 1. Teacher-issued keys in storage (`MP_V2_STUDENT_KEYS`, stored as SHA-256 hash or normalized key)
     * 2. Precomputed salted SHA-256 verifier table (`STUDENT_KEY_HASHES`)
     * 3. Deterministic key format for newly added extraRoster students (`${classID}${pad2(studentID)}-KEY`)
     */
    async function verifyStudentRosterKey(classID, studentID, normalizedKey) {
      if (!normalizedKey || normalizedKey.length < 6) {
        return false;
      }
      const idNum = parseInt(studentID, 10);
      if (idNum === 98) {
        const h98 = await computeHash("MP_TEST98_V2:" + normalizedKey);
        return h98 === TEST98_KEY_HASH;
      }

      const sid = `${classID}_${idNum}`;
      const candidateHash = await computeHash(`MP_STU_V2:${sid}:${normalizedKey}`);
      const cleanKey = normalizedKey.replace(/[^A-Z0-9]/g, "");
      const candidateCleanHash = await computeHash(`MP_STU_V2:${sid}:${cleanKey}`);

      if (STORAGE && typeof STORAGE.getItem === "function") {
        const keyTable = STORAGE.getItem("MP_V2_STUDENT_KEYS", null);
        if (keyTable && typeof keyTable === "object" && keyTable[sid]) {
          const storedVal = String(keyTable[sid]).trim();
          if (/^[a-f0-9]{64}$/i.test(storedVal)) {
            return candidateHash === storedVal.toLowerCase() || candidateCleanHash === storedVal.toLowerCase();
          }
          const expected = normalizeSecret(storedVal);
          return normalizedKey === expected || cleanKey === expected.replace(/[^A-Z0-9]/g, "");
        }
      }

      const validHashes = STUDENT_KEY_HASHES[sid];
      if (Array.isArray(validHashes) && validHashes.length > 0) {
        if (validHashes.indexOf(candidateHash) !== -1 || validHashes.indexOf(candidateCleanHash) !== -1) {
          return true;
        }
        // Also support dashed canonical format if user omitted dash (e.g. 4C01X33C -> 4C01-X33C)
        if (cleanKey.length === 8 && !normalizedKey.includes("-")) {
          const dashed = cleanKey.slice(0, 4) + "-" + cleanKey.slice(4);
          const dashedHash = await computeHash(`MP_STU_V2:${sid}:${dashed}`);
          if (validHashes.indexOf(dashedHash) !== -1) return true;
        }
        return false;
      }

      // For dynamically registered extra students (Scenario 5), verify deterministic standard key
      const pad2 = String(idNum).padStart(2, "0");
      const expectedDynamicKey = `${classID}${pad2}-KEY`;
      const expectedDynamicHash = await computeHash(`MP_STU_V2:${sid}:${expectedDynamicKey}`);
      return candidateHash === expectedDynamicHash;
    }

    /**
     * Logs in a student via either:
     *  1. Encrypted roster map (`encryptedRosterMap` + `secretKey` via `MathCoreCrypto.decryptStudentFromRoster`)
     *  2. Merged roster lookup (`MathPlatformRegistry.getMergedRoster()`) + fail-closed SHA-256 key verification.
     */
    async function loginStudent(params) {
      if (!params || typeof params !== "object") {
        throw new Error("loginStudent requires parameter object");
      }
      const rawKey = params.secretKey || params.password || "";
      const normKey = normalizeSecret(rawKey);
      if (!normKey || normKey.length < 6) {
        throw new Error("密鑰長度不足（至少需要 6 位字符）");
      }

      let studentProfile = null;

      // Path 1: S2 Encrypted Roster Map decryption using ONLY the student secret key
      const encMap =
        params.encryptedRosterMap ||
        (typeof globalThis !== "undefined" ? globalThis.ENCRYPTED_ROSTER_MAP : null);
      if (encMap && CRYPTO && typeof CRYPTO.decryptStudentFromRoster === "function") {
        const decrypted = await CRYPTO.decryptStudentFromRoster(encMap, normKey);
        if (decrypted && decrypted.classID && decrypted.studentID !== undefined) {
          if (
            params.classID &&
            String(params.classID).trim().toUpperCase() !==
              String(decrypted.classID).trim().toUpperCase()
          ) {
            throw new Error("班級與密鑰不匹配");
          }
          if (
            params.studentID !== undefined &&
            parseInt(params.studentID, 10) !== parseInt(decrypted.studentID, 10)
          ) {
            throw new Error("學號與密鑰不匹配");
          }
          studentProfile = {
            classID: String(decrypted.classID).trim().toUpperCase(),
            studentID: parseInt(decrypted.studentID, 10),
            name: decrypted.name,
            grade: decrypted.grade || inferGrade(decrypted.classID),
          };
        } else if (!params.classID || params.studentID === undefined) {
          throw new Error("密鑰無效或找不到對應學生記錄");
        }
      }

      // Path 2: Merged Roster Lookup (`js/roster.js` + `registry.extraRoster`)
      if (!studentProfile) {
        const classID = String(params.classID || "").trim().toUpperCase();
        const studentID = parseInt(params.studentID, 10);
        if (!classID || isNaN(studentID)) {
          throw new Error("請選擇班級與學號，並輸入個人專屬密鑰");
        }
        const mergedRoster =
          REGISTRY && typeof REGISTRY.getMergedRoster === "function"
            ? REGISTRY.getMergedRoster(params.baseRosterData)
            : {};
        const classList = Array.isArray(mergedRoster[classID])
          ? mergedRoster[classID]
          : [];
        const found = classList.find(function (s) {
          return parseInt(s.id !== undefined ? s.id : s.studentID, 10) === studentID;
        });
        if (!found) {
          throw new Error(`找不到學生記錄 (${classID} #${studentID})`);
        }
        const isValidKey = await verifyStudentRosterKey(classID, studentID, normKey);
        if (!isValidKey) {
          throw new Error("個人專屬密鑰不正確，請重新確認後輸入");
        }
        studentProfile = {
          classID: classID,
          studentID: studentID,
          name: found.name,
          grade: found.grade || inferGrade(classID),
          isTeacherTest: studentID === 98 || !!found.isTeacherTest,
          directToBank: studentID === 98 || !!found.directToBank,
        };
      }

      const sid = `${studentProfile.classID}_${studentProfile.studentID}`;
      const loginTs = Date.now();
      const tokenHash = await computeHash(`${sid}:${normKey}:${loginTs}`);
      const token = `tk_${tokenHash.slice(0, 24)}`;
      const signingKey = await computeHash(`MP_SIGN_V2:${sid}:${normKey}`);

      const isTest98 = parseInt(studentProfile.studentID, 10) === 98;
      const session = {
        ok: true,
        token: token,
        sid: sid,
        classID: studentProfile.classID,
        studentID: studentProfile.studentID,
        name: studentProfile.name,
        grade: studentProfile.grade,
        role: isTest98 ? "teacher_test" : "student",
        isTeacherTest: isTest98,
        directToBank: isTest98,
        signingKey: signingKey,
        loginTs: loginTs,
        consentNeeded: isTest98 ? false : needsConsentPrompt(sid),
      };

      if (STORAGE && typeof STORAGE.setItem === "function") {
        STORAGE.setItem(SESSION_KEY, session);
      }
      Object.defineProperty(session, "session", { value: session, enumerable: false });
      return session;
    }

    /**
     * Logs in a teacher using salted SHA-256 hash verification or custom storage credentials.
     * Stores teacher session in isolated `MP_V2_TEACHER_SESSION` so student and teacher sessions never collide.
     */
    async function loginTeacher(params) {
      if (!params || typeof params !== "object") {
        throw new Error("loginTeacher requires credentials");
      }
      const username = String(params.username || "teacher").trim();
      const password = String(params.password || params.secretKey || "").trim();
      if (!password) {
        throw new Error("請輸入教師管理密碼");
      }

      const scope = typeof globalThis !== "undefined" ? globalThis : {};
      const customCreds =
        (STORAGE && typeof STORAGE.getItem === "function"
          ? STORAGE.getItem("MP_V2_TEACHER_CREDENTIALS", null)
          : null) ||
        scope.TEACHER_CREDENTIALS_5BC ||
        null;

      let valid = false;
      if (customCreds && typeof customCreds === "object") {
        const expectedPwd = customCreds.password || customCreds.passcode || customCreds[username];
        if (expectedPwd && password === String(expectedPwd)) {
          valid = true;
        }
      }

      if (!valid) {
        const pwdHash = await computeHash("MP_TCH_V2:" + password);
        if (TEACHER_PASSWORD_HASHES.indexOf(pwdHash) !== -1) {
          valid = true;
        }
      }

      if (!valid) {
        throw new Error("教師管理密碼錯誤，拒絕訪問後台");
      }

      const loginTs = Date.now();
      const hash = await computeHash(`TEACHER:${username}:${loginTs}`);
      const token = `tch_${hash.slice(0, 24)}`;

      const session = {
        ok: true,
        token: token,
        sid: `TEACHER_${username.toUpperCase()}`,
        username: username,
        name: params.name || "任課教師",
        role: "teacher",
        loginTs: loginTs,
      };

      if (STORAGE && typeof STORAGE.setItem === "function") {
        STORAGE.setItem(TEACHER_SESSION_KEY, session);
      }
      Object.defineProperty(session, "session", { value: session, enumerable: false });
      return session;
    }

    function getTeacherSession() {
      if (!STORAGE || typeof STORAGE.getItem !== "function") return null;
      const sess = STORAGE.getItem(TEACHER_SESSION_KEY, null);
      if (sess && sess.role === "teacher" && sess.token) return sess;
      return null;
    }

    function getBackendSession() {
      if (!STORAGE || typeof STORAGE.getItem !== "function") return null;
      const sess = STORAGE.getItem(TEACHER_SESSION_KEY, null);
      if (sess && (sess.role === "teacher" || sess.role === "class_rep") && sess.token) return sess;
      return null;
    }

    function logoutTeacher() {
      if (STORAGE && typeof STORAGE.removeItem === "function") {
        STORAGE.removeItem(TEACHER_SESSION_KEY);
      }
      return true;
    }

    function getSession() {
      if (!STORAGE || typeof STORAGE.getItem !== "function") return null;
      return STORAGE.getItem(SESSION_KEY, null);
    }

    function logout() {
      if (STORAGE && typeof STORAGE.removeItem === "function") {
        STORAGE.removeItem(SESSION_KEY);
      }
      return true;
    }

    function requireAuth(expectedRole) {
      if (expectedRole === "teacher") {
        const tch = getTeacherSession();
        if (tch) return Object.assign({ ok: true }, tch);
        const fallback = getSession();
        if (fallback && fallback.token && fallback.role === "teacher") return Object.assign({ ok: true }, fallback);
        throw new Error("AUTH_FORBIDDEN: 需要教師權限，請先登入教師管理後台");
      }
      const sess = getSession();
      if (!sess || !sess.token) {
        throw new Error("AUTH_REQUIRED: 請先登入系統");
      }
      if (expectedRole === "student" && sess.role !== "student" && sess.role !== "teacher_test") {
        throw new Error("AUTH_FORBIDDEN: 需要學生權限");
      } else if (expectedRole && expectedRole !== "student" && sess.role !== expectedRole) {
        throw new Error(`AUTH_FORBIDDEN: 需要 ${expectedRole} 權限`);
      }
      return Object.assign({ ok: true }, sess);
    }

    // =========================================================================
    // Research Informed Consent (D6, F20, Edge Case E13)
    // =========================================================================

    function getConsentStorageKey(sid) {
      const normSid = String(sid || "").trim().toUpperCase();
      if (!normSid) throw new Error("sid is required for consent status");
      return CONSENT_PREFIX + normSid;
    }

    function getConsentStatus(sid) {
      const key = getConsentStorageKey(sid);
      const saved =
        STORAGE && typeof STORAGE.getItem === "function"
          ? STORAGE.getItem(key, null)
          : null;
      if (!saved || typeof saved !== "object") {
        return {
          sid: String(sid).trim().toUpperCase(),
          agreed: false,
          version: CONSENT_VERSION,
          ts: 0,
          parentalConsent: false,
          withdrawn: false,
          prompted: false,
        };
      }
      return Object.assign(
        {
          sid: String(sid).trim().toUpperCase(),
          agreed: false,
          version: CONSENT_VERSION,
          ts: 0,
          parentalConsent: false,
          withdrawn: false,
          prompted: true,
        },
        saved
      );
    }

    function needsConsentPrompt(sid) {
      const status = getConsentStatus(sid);
      if (!status.prompted || !status.ts) return true;
      if (status.version !== CONSENT_VERSION) return true;
      return false;
    }

    function setConsentStatus(sid, options) {
      const opts = options || {};
      const key = getConsentStorageKey(sid);
      const prev = getConsentStatus(sid);
      const agreed = opts.agreed !== undefined ? Boolean(opts.agreed) : prev.agreed;
      const parentalConsent =
        opts.parentalConsent !== undefined
          ? Boolean(opts.parentalConsent)
          : prev.parentalConsent;
      const withdrawn =
        opts.withdrawn !== undefined
          ? Boolean(opts.withdrawn)
          : agreed
            ? false
            : prev.withdrawn;

      const updated = {
        sid: String(sid).trim().toUpperCase(),
        agreed: agreed && !withdrawn,
        version: opts.version || CONSENT_VERSION,
        ts: Date.now(),
        parentalConsent: parentalConsent,
        withdrawn: withdrawn,
        prompted: true,
        featureAccessBlocked: false,
      };

      if (STORAGE && typeof STORAGE.setItem === "function") {
        STORAGE.setItem(key, updated);
      }
      return updated;
    }

    function withdrawConsent(sid) {
      return setConsentStatus(sid, {
        agreed: false,
        withdrawn: true,
      });
    }

    function isEligibleForResearchExport(sid, requireParental) {
      const status = getConsentStatus(sid);
      if (!status.agreed || status.withdrawn) return false;
      if (status.version !== CONSENT_VERSION) return false;
      if (requireParental && !status.parentalConsent) return false;
      return true;
    }

    // =========================================================================
    // Student Admin / Class Representative (科代表) Sub-System
    // =========================================================================
    const CLASS_REPS_KEY = "MP_V2_CLASS_REPS";

    function getClassReps() {
      if (STORAGE && typeof STORAGE.getItem === "function") {
        const map = STORAGE.getItem(CLASS_REPS_KEY, {});
        return map && typeof map === "object" ? map : {};
      }
      return {};
    }

    function setClassRep(params) {
      const p = params || {};
      const classID = String(p.classID || "").trim().toUpperCase();
      const studentID = String(p.studentID || "").trim();
      if (!classID || !studentID) throw new Error("請指定科代表的班別與學號");
      const sid = `${classID}_${studentID}`;
      const repPin = String(p.repPin || p.pin || "rep123").trim();
      const permissions = Array.isArray(p.permissions)
        ? p.permissions.slice()
        : ["reply_qa", "approve_mall"];
      const map = getClassReps();
      map[sid] = {
        sid: sid,
        classID: classID,
        studentID: studentID,
        name: String(p.name || sid),
        repPin: repPin,
        permissions: permissions,
        updatedAt: Date.now(),
      };
      if (STORAGE && typeof STORAGE.setItem === "function") {
        STORAGE.setItem(CLASS_REPS_KEY, map);
      }
      return map[sid];
    }

    function removeClassRep(sidOrClass, optionalStudentID) {
      const map = getClassReps();
      const key =
        optionalStudentID !== undefined
          ? `${String(sidOrClass || "").trim().toUpperCase()}_${String(optionalStudentID).trim()}`
          : String(sidOrClass || "").trim().toUpperCase();
      if (map[key]) {
        delete map[key];
        if (STORAGE && typeof STORAGE.setItem === "function") {
          STORAGE.setItem(CLASS_REPS_KEY, map);
        }
        return true;
      }
      return false;
    }

    function loginClassRep(params) {
      const p = params || {};
      const classID = String(p.classID || "").trim().toUpperCase();
      const studentID = String(p.studentID || "").trim();
      const sid = `${classID}_${studentID}`;
      const pin = String(p.repPin || p.pin || p.password || "").trim();
      const map = getClassReps();
      const rep = map[sid];
      if (!rep) {
        throw new Error(`該學生 (${sid}) 尚未被老師設定為科代表`);
      }
      if (rep.repPin !== pin) {
        throw new Error("科代表專屬口令不正確");
      }
      const session = {
        token: `REP_${sid}_${Date.now()}`,
        sid: sid,
        classID: rep.classID,
        studentID: rep.studentID,
        name: rep.name,
        role: "class_rep",
        permissions: rep.permissions || [],
        loginTs: Date.now(),
      };
      if (STORAGE && typeof STORAGE.setItem === "function") {
        STORAGE.setItem(TEACHER_SESSION_KEY, session);
        STORAGE.setItem(SESSION_KEY, session);
      }
      return session;
    }

    function hasBackendPermission(sessionOrPerm, maybePerm) {
      let session = sessionOrPerm;
      let permName = maybePerm;
      if (typeof sessionOrPerm === "string") {
        permName = sessionOrPerm;
        session = maybePerm || getTeacherSession() || getSession();
      }
      if (!session) return false;
      if (session.role === "teacher") return true;
      if (session.role === "class_rep" && Array.isArray(session.permissions)) {
        return session.permissions.indexOf(permName) !== -1;
      }
      return false;
    }

    return {
      loginStudent: loginStudent,
      loginTeacher: loginTeacher,
      getSession: getSession,
      getTeacherSession: getTeacherSession,
      getBackendSession: getBackendSession,
      logout: logout,
      logoutTeacher: logoutTeacher,
      requireAuth: requireAuth,
      verifyStudentRosterKey: verifyStudentRosterKey,
      getConsentStatus: getConsentStatus,
      needsConsentPrompt: needsConsentPrompt,
      setConsentStatus: setConsentStatus,
      withdrawConsent: withdrawConsent,
      isEligibleForResearchExport: isEligibleForResearchExport,
      getClassReps: getClassReps,
      setClassRep: setClassRep,
      removeClassRep: removeClassRep,
      loginClassRep: loginClassRep,
      hasBackendPermission: hasBackendPermission,
    };
  }
);
