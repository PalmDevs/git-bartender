<p align="center"><img src="./assets/logo.webp" alt="Git Bartender Logo" width="200"/></p>
<h1 align="center">Git Bartender</h1>
<p align="center">Providing Git shortcuts as well as a drinking problem and occasional yelling.</p>
<p align="center">
A Git CLI wrapper that provides shortcuts for useful Git commands you'd usually forget after searching.<br>
As long as something looks enough like a command, the bartender will <i>probably</i> get it right for you, so be as drunk as you'd like!
</p>

# ⬇️ Installation

1. Install [Bun](https://bun.sh)
2. Install Git Bartender globally using Bun

   ```sh
   bun install https://github.com/PalmDevs/git-bartender --global
   ```

3. Enjoy your new companion

   ```sh
   git-bartender help
   # or
   gb help
   ```

# 🍹 Usage

| Command                 | Description                                                                  | Aliases                | Usage/Examples                                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| help                    | Shows the manual, so I can deal with less bullshit from you.                 | h                      | `gb help`  <br> `gb help [command]` <br> `gb help [alias]`                                                        |
| abort                   | What ya mom should've done years ago. Aborts a stuck process.                | ab                     | `gb abort`                                                                                                       |
| discard                 | Wasted time on something that didn't work?                                   | explode, dc            | `gb discard`                                                                                                     |
| github                  | Things related to the Hub- shit. Walked myself right into that one.          | gh                     | `gb github <subcommand>`                                                                                         |
| github actions          | Just pushed your changes? Want to watch the deployment fail?                 | a, action              | `gb github actions` <br> `gb github actions [workflow]` <br> `gb github actions [workflow] --branch [branch]` <br> `gb github actions [workflow] -b [branch]` |
| github pull-request     | Open a pull request. What did you expect?                                    | pr, pullrequest        | `gb github pull-request` <br> `gb github pull-request <target_branch>` <br> `gb github pull-request <target_remote>/[target_branch]` <br> `gb github pull-request <target_remote>/[target_branch]:<from_remote>/[from_branch]` <br> <br>**Examples:** <br> `gb github pull-request dev` <br> `gb github pull-request upstream/main` <br> `gb github pull-request dev:staging` <br> `gb github pull-request dev:upstream/main` <br> `gb github pull-request /main:upstream/` |
| ignore                  | Ignore your files, like ignoring your problems.                              | i                      | `gb ignore [...patterns]` <br> `gb ignore` (view ignored files)                                                 |
| pet                     | Petting me? Seriously?                                                       |                        | `gb pet`                                                                                                         |
| unignore                | Unignoring your problems now? Good for you.                                  | u                      | `gb unignore [...patterns]`                                                                                      |
| undo                    | Uncommits your commits because you have commitment issues.                   | ud                     | `gb undo [amount]`                                                                                               |
| unstage                 | Did you fuckin' stage .env? Remove that!                                     | unadd, !add            | `gb unstage [...files]`                                                                                           |
| what   | Are you _really_ dumb enough to not know info about the project you're literally working on? | which                   | `gb what <subcommand>`                                                                                           |
| what branch          | Really? Did you **seriously** forget what branch you're working on? _Dumbass_. | which branch            | `gb what branch`                                                                                           |

# ⏱️ Future Plans

- Add `gb github actions Owner/Repo` (notice `Owner/Repo`)
- Make `gb help` show examples
- Auto-correcting arguments like branch names passed into `gb github pull-request`
- Add `gb continue` (to continue whatever operation you're stuck on)
- Add `gb list` (lists files based on predefined filters)
- Add `gb push` (pushes with attempts to fix when it fails)
- Add `gb pull` (pulls with attempts to fix when it fails)
- Add `gb add` (`git add` with staging certain ranges, but you type it all out instead of doing it in interactive staging)
