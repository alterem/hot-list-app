# iOS 构建设置指南

本文档说明如何配置 GitHub Actions 以构建 iOS IPA 文件。

## 必需的 GitHub Secrets

在使用 iOS 构建工作流之前，你需要在 GitHub 仓库中配置以下 Secrets：

### 1. IOS_CERTIFICATE_BASE64
- **描述**: iOS 开发者证书的 Base64 编码
- **获取方式**: 
  1. 从 Apple Developer 账户下载 `.p12` 证书文件
  2. 使用命令转换为 Base64: `base64 -i certificate.p12 | pbcopy`
  3. 将输出的字符串添加到 GitHub Secrets

### 2. IOS_CERTIFICATE_PASSWORD
- **描述**: iOS 开发者证书的密码
- **获取方式**: 创建 `.p12` 证书时设置的密码

### 3. IOS_PROVISIONING_PROFILE_BASE64
- **描述**: iOS 配置文件的 Base64 编码
- **获取方式**:
  1. 从 Apple Developer 账户下载 `.mobileprovision` 文件
  2. 使用命令转换为 Base64: `base64 -i profile.mobileprovision | pbcopy`
  3. 将输出的字符串添加到 GitHub Secrets

### 4. IOS_TEAM_ID
- **描述**: Apple Developer Team ID
- **获取方式**: 在 Apple Developer 账户的 Membership 页面查看

### 5. KEYCHAIN_PASSWORD
- **描述**: 用于创建临时 keychain 的密码
- **设置方式**: 设置一个强密码（建议使用随机生成的密码）

## 配置步骤

### 1. 准备证书和配置文件

1. **创建 App ID**:
   - 登录 [Apple Developer](https://developer.apple.com)
   - 进入 Certificates, Identifiers & Profiles
   - 创建新的 App ID，Bundle ID 为: `com.alterem.hotlistapp`

2. **创建证书**:
   - 创建 iOS Distribution 证书
   - 下载并安装到 Keychain
   - 导出为 `.p12` 文件

3. **创建配置文件**:
   - 创建 Ad Hoc 或 App Store 配置文件
   - 选择对应的 App ID 和证书
   - 下载 `.mobileprovision` 文件

### 2. 添加 GitHub Secrets

1. 进入 GitHub 仓库设置
2. 选择 "Secrets and variables" > "Actions"
3. 点击 "New repository secret"
4. 逐一添加上述 5 个 secrets

### 3. 运行构建

1. 进入 GitHub 仓库的 Actions 页面
2. 选择 "Build iOS IPA" 工作流
3. 点击 "Run workflow"

## 注意事项

- **证书有效期**: iOS 证书通常有效期为 1 年，需要定期更新
- **配置文件**: Ad Hoc 配置文件只能安装在指定的设备上
- **Team ID**: 确保使用正确的 Team ID，否则签名会失败
- **Bundle ID**: 确保 `app.json` 中的 `bundleIdentifier` 与证书匹配

## 故障排除

### 常见错误

1. **Code signing failed**:
   - 检查证书是否有效
   - 确认 Team ID 正确
   - 验证配置文件是否匹配

2. **Provisioning profile not found**:
   - 确认配置文件 Base64 编码正确
   - 检查配置文件是否包含正确的 App ID

3. **Keychain access denied**:
   - 确认 keychain 密码正确
   - 检查证书导入是否成功

### 调试建议

- 在 Actions 日志中查看详细错误信息
- 确保所有 secrets 都已正确设置
- 验证证书和配置文件在本地 Xcode 中可以正常使用

## 构建产物

成功构建后，IPA 文件将会：
1. 上传到 GitHub Release
2. 文件名格式: `hotListApp.{version}.ipa`
3. Release 标签格式: `ios-v{version}`

构建的 IPA 可以通过以下方式分发：
- TestFlight (需要 App Store Connect 配置)
- 直接安装 (Ad Hoc 配置文件)
- 企业分发 (Enterprise 证书)



配置项目禁用代码签名 后 继续构建

```bash
#pnpm run build-ios

cd ios && xcodebuild -workspace hotlistapp.xcworkspace -scheme hotlistapp -configuration Release -destination generic/platform=iOS -archivePath hotlistapp.xcarchive archive CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO
```

```bash
cd ios && mkdir -p build/Payload && cp -r hotlistapp.xcarchive/Products/Applications/hotlistapp.app build/Payload/ && cd
 build && zip -r hotlistapp.ipa Payload
```