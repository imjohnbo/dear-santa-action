# Dear Santa Action 🎅

> Write to Santa 🎅 and he'll respond with just the right Christmas greeting 🎄

Ever wanted to send your wishlist to Santa from the comfort of your GitHub repository? Well, now you can! 🤓 🎉 

Santa's on GitHub! Just type `Dear Santa` in an issue followed by the gifts you've been hoping and wishing for all year. He'll send a prompt response but is particularly keen on green GitHub Actions builds... have you been naughty or nice this year? ✅ ❌

<img src="https://user-images.githubusercontent.com/2993937/71137894-aa798f80-21d7-11ea-8570-26dc20c2bcdf.png" />

## Usage

```yaml
name: "Dear Santa"
on:
  issue_comment:
  issues:
    types: [opened, edited]

jobs:
  dear-santa:
    runs-on: ubuntu-latest
    steps:
    - uses: imjohnbo/dear-santa-action@v1
```

## Contributing

Pull requests welcome! 

## License

[MIT](LICNESE)
