import { Container, makeStyles } from "@material-ui/core";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import CardItem from "../components/CardItem";
import formatPostTime from "../helper/formatPostTime";
import { Post } from "../types";

import { readdir, readFile } from "fs/promises";
import path from "path";
import getTitle from "../helper/getTitle";

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: "42rem",
  },

  mainCard: {
    margin: "0 auto",
    padding: 10,
  },
}));

export default function Home(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>Junior go Code</title>
        <meta
          name="description"
          content="Junior Go Code. Blogs for developers"
        />

        <meta property="og:url" content="/" />
        <meta property="og:title" content="Junior go Code" />
        <meta
          property="og:image"
          content="https://juniorgocode.com/cover.png"
        />
        <meta
          property="og:description"
          content="Junior Go Code. Blogs for developers"
        />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@jrgocode" />
        <meta name="twitter:title" content="Junior go Code" />
        <meta
          property="twitter:image"
          content="https://juniorgocode.com/cover.png"
        />
        <meta
          name="twitter:description"
          content="Junior Go Code. Blogs for developers"
        />
      </Head>
      <Container className={classes.root}>
        {/* Loop over the posts */}
        {props.posts &&
          props.posts.map((post) => <CardItem post={post} key={post.id} />)}
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps<{ posts: Post[] }> = async () => {
  // Get post from our Strapi API and sort by updated date
  const posts: Post[] = [
    {
      id: "3",
      title: "What is functional form of setState",
      content:
        '## Terms\n\nIn the code below\n\n```tsx\nconst [state, setState] = useState(0);\n```\n\nI will call variable in `state` position as **state variable <name_of_variable>** (for example, the state variable `count`)\n\nI will call function in `setState` position as **state-update function <name_of_function>** (for example, the state-update function `setCount`)\n\nI will call value in `0` position as **initial value of state <name_of_state>** (for example, the initial value of state `count`)\n\n## What is the functional form of state-update function\n\nLet take a look at the code below\n\n```tsx\n// Example 1\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  const incrementHandler() => {\n    setCount(count + 1)\n  }\n\n  return (\n    <>\n      Count: {count}\n      <button onClick={() => setCount(0)}>Reset</button>\n      <button onClick={incrementHandler}>Increment</button>\n    </>\n  );\n}\n```\n\nThis is the very basic React app: we have a state variable and we want to update this state variable whenever the button is clicked.\n\nLet take a look at a different way we can write our `incrementHandler`\n\n```tsx\n// Example 2\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  function increment = number => number + 1\n\n  const incrementHandler = () => {\n    setCount(increment)\n  }\n\n  return (\n    <>\n      Count: {count}\n      <button onClick={() => setCount(0)}>Reset</button>\n      <button onClick={incrementHandler}>Increment</button>\n    </>\n  );\n}\n```\n\nIn this example 2, we use the functional form of state-update function to update state variable. We pass a function to `setCount` and the return value of this function is the new value for `count`. This function will take in current state as its parameter.\n\nSo in our example, we have:\n\n- `increment` is the function we pass to `setCount` to update state variable `count`\n- `increment` argument is the current state variable `count`\n- `increment` return value will be the new value for state variable `count`\n\nLet take a look at another example:\n\n```tsx\n// Example 3\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  const [price, setPrice] = useState(10)\n\n  function increment = number => number + 1\n\n  const incrementCountHandler = () => {\n    setCount(increment)\n  }\n\n  const incrementPriceHandler = () => {\n    setPrice(increment)\n  }\n\n  const reset = ( ) => {\n    setCount(0)\n    setPrice(10)\n  }\n\n  return (\n    <>\n      Count: {count}\n      Price: {price}\n      <button onClick={}>Reset</button>\n      <button onClick={incrementCountHandler}>Increment count</button>\n      <button onClick={incrementPriceHandler}>Increment price</button>\n    </>\n  );\n}\n```\n\nIn this example 3, we pass the same function `increment` to `setCount` and `setPrice` and let us analyze what to use what for each case.\n\nFor function `increment` that is passed to `setCount`:\n\n- `increment` argument is the current state variable `count`\n- `increment` return value will be the new value for state variable `count`\n\nFor function `increment` that is passed to `setPrice`:\n\n- `increment` argument is the current state variable `price`\n- `increment` return value will be the new value for state variable `price`\n\nSo we can see that the function `increment` receive _only state variable that is managed by that state-update function_ as argument, not all state existing within the app.\n\n**But why do we need this functional form in the first place?**\n\nThe answer is: when you need to update state based off the previous state where the normal method fails to do.\n\n## Different between normal and functional form of state-update function?\n\n- The normal one `setState(value)` uses the value of `value` at the time the function `setState` is called. It doesn\'t know whether the value of `value` is staled or not (due to closure)\n- The functional one `setState(oldState => value)` gives instruction to React: hey React, use the **LATEST, MOST UP-TO-DATE** value of state variable to create a new value. Multiple instructions of these kind can be stacked together and the new state of one is the `oldState` of another.\n\nLet analyze this by using a very simple example:\n\n```tsx\n// Example 4\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  const handleClick = () => {\n    setCount(count + 5); // (1) setCount\n    setCount(count + 7); // (2) setCount\n  };\n\n  return (\n    <div>\n      Count is: {count}\n      <button onClick={handleClick}>Change count</button>\n    </div>\n  );\n}\n```\n\nThis is what happened when we click the button:\n\n1. We click on the button and function `handleClick` is called\n2. `(1) setCount` is called with **the function `handleClick` receiving the the state-variable `count` with value 0 at the called time**\n3. `(2) setCount` is called with **the function `handleClick` receiving the the state-variable `count` with value 0 at the called time**\n4. As there is no more state-update function, both the state-update functions above are combined and being executed\n5. `(1) setCount` set the count value to 5. `(2) setCount` set the count value to 7. Since `(2) setCount` is after `(1) setCount`, the _final value_ of `count` is 7\n\n---\n\nIn comparison with using functional form\n\n```tsx\n// Example 5\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  const handleClick = () => {\n    setCount((count) => count + 5); // (1) setCount\n    setCount((count) => count + 7); // (2) setCount\n  };\n\n  return (\n    <div>\n      Count is: {count}\n      <button onClick={handleClick}>Change count</button>\n    </div>\n  );\n}\n```\n\nThis is what happened when we click the button:\n\n1. We click on the button and function `handleClick` is called\n2. `(1) setCount` is called, which trigger the callback inside\n3. This callback gives React instruction: increase `count` by `5` with whatever the latest `count` value is\n4. `(2) setCount` is called, which trigger the callback inside\n5. This callback gives React instruction: increase `count` by `7` with whatever the latest `count` value is\n6. As there is no more state-update function, both the state-update functions above are combined and being executed\n7. At the very beginning, `count` is `0`. The latest value of `count` at the first instruction is `0`. Thus `count` is updated to `5`. The second instruction use the latest value of `count`, which is `5` right now. And thus `count` is updated to `12`\n8. The final value of `count` is 12\n\n---\n\nLet take a look at a more realistic example of a problem we may face when trying to update a state variable:\n\n```tsx\n// Example 6\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  const slowClick = () => {\n    // This can be any asynchronous action like API call, DOM update, etc.\n    setTimeout(() => {\n      setCount(count + 10);\n    }, 2000);\n  };\n\n  const fastClick = () => {\n    setCount(count + 1);\n  };\n\n  const reset = () => {\n    setCount(0);\n  };\n\n  return (\n    <div className="App">\n      <h1>Slow-fast button</h1>\n      <h2>Count is: {count}</h2>\n\n      <button onClick={slowClick}>Slow click</button>\n      <button onClick={fastClick}>Fast click</button>\n\n      <div>\n        <button onClick={reset}>Reset</button>\n      </div>\n    </div>\n  );\n}\n```\n\nIf you try out the code above, you probably notice that the state-update function doesn\'t run as you expected: you click on the `Slow click` button really fast for multiple times (let say you click 3 times really fast) but the state variable `count` only update one and the value of `count` is only `10` instead of `30`.\n\nWorse of that, if you try to click on `Slow click` button and `Fast click` button really fast (let say 2 times on slow click and 3 time on fast click) the state variable `count` is still only `10` instead of `23`.\n\n## So what had happened here? Why example 4 and 6 failed\n\nThe answer is [closure](https://overreacted.io/a-complete-guide-to-useeffect/). I will not go into detail about what closure is (since that is a long topic on its own) and instead, I will provide you with a way to solve this issue using functional form of state-update function\n\n```tsx\n// Example 7\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  const slowClick = () => {\n    setTimeout(() => {\n      setCount((count) => count + 10);\n    }, 2000);\n  };\n\n  const fastClick = () => {\n    setCount(count + 1);\n  };\n\n  const reset = () => {\n    setCount(0);\n  };\n\n  return (\n    <div className="App">\n      <h1>Slow-fast button</h1>\n      <h2>Count is: {count}</h2>\n\n      <button onClick={slowClick}>Slow click</button>\n      <button onClick={fastClick}>Fast click</button>\n\n      <div>\n        <button onClick={reset}>Reset</button>\n      </div>\n    </div>\n  );\n}\n```\n\nBy changing from normal update to using a callback to update state, we get everything work as we expected.\n\n## Batching or Closure\n\n**Batching** is the behavior where multiple state-update functions are batched and run at them same time, results in a single state update and thus, only one re-render.\n\n**Closure**, in the React context and in our example, means that a function is "closed", mean that the variable it received when it was called will remain as is, despite the fact that outside of the function, that variable may be updated or changed.\n\nIn example 6, batching only affects how many time the component re-render and not the final value of state variable. Closure is the one that affect the final value of state variable. We can test this our by eliminate batching in our example (for more info about batching, see [when does React batch state](/link-somewhere))\n\n```tsx\n// Example 8\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  const handleClick = async () => {\n    await setCount(count + 5); // The await does nothing on setCount. It only disable batching\n    setCount(count + 7); //\n  };\n\n  return (\n    <div>\n      Count is: {count}\n      <button onClick={handleClick}>Change count</button>\n    </div>\n  );\n}\n```\n\nYou can read more about closure in React state in [this article written by Dan Abramov](https://overreacted.io/a-complete-guide-to-useeffect/) . Although the article doesn\'t specifically talk about closure but it still provides a very good explanation on the topic.\n\n## Reference\n\n- [React Official API on setState](https://reactjs.org/docs/hooks-reference.html#usestate)\n- [Dan Abramov article on closure](https://overreacted.io/a-complete-guide-to-useeffect/)\n',
      slug: "what-is-functional-form-of-setstate",
      description:
        "If you use React Hooks before, you are probably familiar with using `setState` with a single value. But do you know it has a functional form?",
      created_at: "2021-08-28T03:54:50.580Z",
      updated_at: "2021-08-28T03:54:52.344Z",
    },
    {
      id: "2",
      title: "State batching - what is that ?",
      content:
        '**NOTE**: At the time of writing, React 18 hasn\'t been released and [in the React 18 brief](https://reactjs.org/blog/2021/06/08/the-plan-for-react-18.html) the behavior of state batching will change for the better. For more information about React 18 change, read [this GitHub discussion](https://github.com/reactwg/react-18/discussions/4) This article will cover the state batching of React version 17 and below.\n\n## Terms\n\nIn the syntax\n\n```tsx\nconst [state, setState] = useState(0);\n```\n\nI will call variable in `state` position as **state variable <name_of_variable>** (for example, the state variable `count`)\n\nI will call function in `setState` position as **state-update function <name_of_function>** (for example, the state-update function `setCount`)\n\nI will call value in `0` position as **initial value of state <name_of_state>** (for example, the initial value of state `count`)\n\n## What is state batching\n\nState batching is a React behavior where multiple state-update functions are batched together and run all at once instead of run one by one. Let\'s take a look at the code below\n\n```tsx\nconst App = () => {\n  const [a, setA] = useState(0);\n  const [b, setB] = useState("hello");\n\n  useEffect(() => {\n    console.log("State change");\n  });\n\n  const handleClick = () => {\n    setA(a + 1);\n    setB(b + "new hello");\n  };\n\n  return (\n    <div>\n      {a} --- {b}\n      <button onClick={handleClick}>Change state</button>\n    </div>\n  );\n};\n```\n\nTry to run the code above and click on the button. Can you guess how many time you will see the log message `State change`?\n\nThe answer is **1 log message per button click**. When I first learn React I did the wrong guess, which is 2 log messages per button click. Our guess of 2 logs is wrong as we can easily test with the code above. But why is it? Let analyze why we came up with such and what actually happened.\n\n---\n\nThis is what will happen according to our _expectation_:\n\n- When the button is click, event handler `handleClick` is called\n- This then run the state-update function `setA`\n- `setA` run change the value of state variable `a`\n- The component re-render since there is a change in its state\n- Since value of state variable `a` change, the callback in `useEffect` is called\n- After all of this, the state-update function `setB` run\n- `setB` run change the value of state variable `b`\n- The component re-render since there is a change in its state\n- Since value of state variable `b` change, the callback in `useEffect` is called\n\n---> In short, we will have **two re-render** and **two run of `useEffect` callback**\n\n---\n\nHowever this is what _actually happened_:\n\n- When the button is click, event handler `handleClick` is called\n- ~~This then run the state-update function `setA`~~\n- React say: wait there are 2 state-update functions you need to run - which is `setA` and `setB`. Let combine them and run them at once instead of one by one\n- React see no more state-update functions it needs to run\n- `setA` and `setB` run at the same time\n- The value of state variable `a` and state variable `b` change at the same time\n- The component re-render since there is a change in its state\n- The callback in `useEffect` is called\n\n---> We only have **ONE re-render** and **ONE run of `useEffect` callback**\n\nThis is what state batching does: it combines multiple state-update functions into one "batch" and run all these functions at once\n\n**But why do we need state batching?**\n\nAs you can see in the example above, without state batching we need to run an additional re-render of component and an additional run of `useEffect` callback. This is worse if we have more state variables compared to our example. Batching save us time and resource.\n\n## Reference\n\n- [Does React keep the order for state updates?](https://stackoverflow.com/questions/48563650/does-react-keep-the-order-for-state-updates/48610973#48610973)\n',
      slug: "state-batching-what-is-that",
      description:
        "State batching is one of the important features of state management of React. But what is it and what benefits does it provide us?",
      created_at: "2021-08-28T03:52:04.865Z",
      updated_at: "2021-08-28T03:52:06.698Z",
    },
    {
      id: "1",
      title: "How to authenticate with a Linux machine remotely?",
      content:
        "## Terms\n\n**Local machine**: refer to the physical machine you are using right now to access the remote machine. In other words, the computer that is probably right in front of you, the computer you can touch.\n\n**Remote machine**: refer to the machine that you are accessing. The machine that is not physically in front of you. The machine that is hosted on a cloud company. In this article I will also use the term **Linux machine** to refer to remote machine\n\n## Assumptions\n\nIn this article I will assume that your remote machine run on some kinds of Linux distributions like Ubuntu, Debian, etc. I assume that the distributions you are running on your remote machine don't have user interface and the only way to interact with the machine is via command line interface (CLI)\n\nThis article is written from the perspective of a Window user. I will try my best to provide guide for other operating systems (like MacOS) but since I have very limited experience with other operating system beside Linux and Window and I also don't have access to machines that run on those operating system to test out, my guide maybe incorrect in those cases.\n\nI also assume you know how to access your machine's terminal in this article. For Windows, you can use either the Command Prompt, Powershell or Git Bash. For MacOS you can use your [default Terminal](https://support.apple.com/guide/terminal/open-or-quit-terminal-apd5265185d-f365-44cb-8b09-71a064a42125/mac). For Linux with user interface, you use the default terminal (quick [tutorial for Ubuntu](https://ubuntu.com/tutorials/command-line-for-beginners#3-opening-a-terminal))\n\nI personally use [Window terminal](https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701?activetab=pivot:overviewtab) with [some customization](https://www.hanselman.com/blog/how-to-make-a-pretty-prompt-in-windows-terminal-with-powerline-nerd-fonts-cascadia-code-wsl-and-ohmyposh). **However** if you are a beginner I suggest stick to Git Bash since you don't want to waste time on choosing what is the best terminal to use.\n\nNow let get start\n\n## How to authenticate with a remote machine\n\nThere are two ways to authenticate with a remote machine: password authentication and public-private key authentication.\n\n### With password authentication\n\nThis is the quick and dirty way for authentication: quick because we don't need any setup but insecure since the inevitable nature of password is that it can be guessed or even brute-forced\n\nSteps:\n\n1. Open your local machine terminal\n\n2. Run command `ssh <username>@<IP_address>`\n\n   For example, if you want to sign in as user `john` on remote machine with IP 123.456.789.12 you would do `ssh john@123.456.789.12`\n\n   Or if you want to sign in as root user on remote machine with IP 456.789.123.56 you would do `ssh root@123.456.789.12`\n\n3. The terminal will prompt you to enter the password. For root password it is the password you created when you first create the remote machine\n\nNote here that, sometimes you cannot authenticate with password if the option for password authentication is disabled. We will learn how to disable password authentication in a separate article\n\n## With public-private key authentication\n\nFirst of all, what is public-private key authentication?\n\nIt is a way for a local machine to authenticate with the remote machine without using any password. All you need to do is run command `ssh <username>@<IP_address>` and puff, you are authenticated\n\nLet's look at little bit more detail on how it works\n\nLet's say we have machine A which is a local machine, which, presumably, means that no one has access to it beside you . And we have machine B which is a remote machine, and we assume that this machine B is in public, means that everyone can access it.\n\nNow in machine A we create a key and a lock. The lock can only be opened using this specific key. Then we give machine B the lock while keep the key securely in machine A. Since only this specific key can open the lock and only machine A has it, machine B can determine whether a machine trying to access is machine A or not by require the key and check whether the key can open the lock or not.\n\nThere you have it. In public-private key authentication, the key in above example is the private key that is kept on your local machine; while the lock is the public key that is kept on remote machine and can be read by everyone. This method of authentication is more secure comparing to password because the key is longer than password and the private key is actually never leave the local machine. You can [read more on this StackExchange answer](https://security.stackexchange.com/a/3898)\n\nNow back on how to setup public-private key authentication\n\n---\n\n### On your local machine\n\n- _First_ check whether you already has a public-private key existed on your machine because you don't want to accidentally overwrite it\n\n  Do so by running command `ls ~/.ssh`. If you see no files displayed then there is no key existing, otherwise, there is existing keys. Take note on those keys' name so not to overwrite them\n\n  Note on syntax: `~` is the home directory for the current user and `.ssh` is the directory that store our config for SSH connection. Each user on the machine has their own home directory (for example, user 'john' will have a home directory named `/home/john`) and thus have their own `.ssh` directory with the config built for them.\n\n- _Second_, we generate our key file by running `ssh-keygen -b 4096` where `-b` flag is used to specify the ket size and `4096` is the key size (since the default key size is too small). We can specify the algorithm with `-t` flag. For example if we want to use ED25519 algorithm with default key size we can run `ssh-keygen -t ed25519`(which is also a good option)\n\n  This will then prompt us to enter file to save the key like so\n\n  ```bash\n  Enter file in which to save the key (C:\\Users\\johndoe/.ssh/id_rsa):\n  ```\n\n  Here is the difference:\n\n  - If **there is NO file exist in `.ssh` directory** we can just use the default file name. In our case since we use the default RSA algorithm, the 2 files are `id_rsa.pub` and `id_rsa`. If you use, let say ED25519 algorithm then the file would be `id_ed25519` and `id_ed25519.pub`\n\n  - If **there are files exist in `.ssh` directory** then we have to either reuse the existing key or create a new one.\n\n  If you choose to reuse the existing key, simply `Ctrl+C` to stop the process. Again those are just the public-private key file - just a string used as key, thus can be re-used without any problem.\n\n  If you want to create a new one, we need to specify the location and file name. The location for the key file doesn't have to be `.ssh`, but because `.ssh` is the default location for anything SSH related and there is no reason to change this, just stick to the default location (change location may potentially cause bug in the future). For the file name, we can choose anything. For our example, we want the filename to be `our-web-server` then we need to type in, in full, `C:\\Users\\johndoe/.ssh/our-web-server`\n\n- _Third_, it will prompt us for a passphrase. This is an extra security step that will protect our private key by encrypt our private key using the passphrase. So in case someone get a copy of the private key, they won't be able to use ir to access to the remote machine. If you don't want to set passphrase, simply hit `Enter`\n\nAnd there you have it: a public key (the file with `pub` extension) that can be sent to remote machine and a private key (the file of the same name without any extension) that is kept in our local machine. Note that the filename of both have to match.\n\nBefore we move on, there is one more step to take: copy the content of the public key to your clipboard. If your local OS have interface that allow mouse click, simply open the public key file (for example, it's `our-web-server.pub`) on any editor (even the terminal editor like Vim or simply using `cat` command also work) then copy everything that is inside that file. If your local OS doesn't have interface and doesn't allow mouse click, we will have to install extension named `xclip`. [You can follow step 1 of this tutorial](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)\n\nNext step is to write the public key onto the remote machine.\n\n---\n\n### On the remote machine\n\n- _First_, change the directory to `~/.ssh` by running `cd ~/.ssh`. If the `.ssh` directory doesn't exist, then we can first change directory to user root by doing `cd ~` then create the directory by running `mkdir .ssh`\n\n- _Second_, create a file named `authorized_keys` inside `.ssh` directory. We can either run `touch authorized_keys` or run `nano authorized_keys`. The later option will create the file AND open up that file for us\n\n- _Third_, open the file `authorized_keys`\n\n- _Fourth_, paste the content of the public key we copy in the last section into this `authorized_keys` file\n\n- _Fifth_, save the file then exit\n\n---\n\nAfter you have done all the steps on both sections above, you can exit from current session on local machine and try SSH again to the remote machine. You should be able to get right onto your remote machine without typing your password. Note that your local machine may prompt you for the passphrase if you did create a passphrase for you public-private key.\n\nIf you encounter any error or just cannot authenticate onto the remote machine or being asked for password again, check out the Potential Error below. If your error message doesn't match any of the below errors, well, you will have to Google it.\n\n---\n\n**NOTES**:\n\n1. Some cloud provider will make you to choose which method of authentication to use at the time you are creating your remote machine (like DigitalOcean for example). When you choose public-private key authentication, you will be, most likely, provided with a form for the public key. With this you don't have to do anything on the **remote machine** section. You only need to do steps in **local machine** section and paste the public key into the form\n\n2. You can actually copy and paste the public key directly to the remote machine from your local machine. If your remote machine doesn't have `.ssh` directory run\n\n   ```bash\n   cat <your_public_key_file> | ssh <username>@<your_remote_IP_address> \"mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys\n   ```\n\n   If it already has one then run\n\n   ```bash\n   cat <your_public_key_file> | ssh <username>@<your_remote_IP_address> \"cat >> ~/.ssh/authorized_keys\n   ```\n\n   For example, if your public key is `my-web-server.pub` located at `~/.ssh`, your remote machine IP is 123.456.789.25 and your remote machine username is john then you do (assume your remote doesn't have `.ssh` directory)\n\n   ```bash\n   cat ~/.ssh/my-web-server.pub | ssh john@123.456.789.25 \"mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys\n   ```\n\n## Potential errors\n\nHere are some errors I encountered when I first learn about this. If your error doesn't match any of these, you should try Google it.\n\n### Error: `Permission denied (publickey)`\n\n---\n\n[Video on the error](https://www.youtube.com/watch?v=hQWRp-FdTpc&t=1729s)\n\n[`ssh-add` do on the authentication](https://superuser.com/questions/360686/what-exactly-does-ssh-add-do)\n\n[Github page on the topic](https://docs.github.com/en/github/authenticating-to-github/troubleshooting-ssh/error-permission-denied-publickey#make-sure-you-have-a-key-that-is-being-used)\n\n- _Description_: when we try to run `ssh root@<ip_address>` using public-private key authentication this error happen prevents us from doing authentication\n\n- _Context_:\n\n  1. We did have a public-private key in `~/.ssh` that has name different from `id_rsa` (for example, our private key file is `our-web-server` and public key file is `our-web-server.pub`)\n  2. We did add the public key into our Linux machine (i.e our Linux did have a `authorized_keys`)\n  3. We try to authenticate using public-private key\n\n- _Reason_: our public-private file, since we use name different from default name `id_rsa` which make it doesn't register with authentication agent. What this means is that when our local machine try to send the private key to Linux machine for authentication, it doesn't send our file `our-web-server` since it doesn't know \"what these files is for\"\n\n  ---> Thus, we need to EXPLICITLY tell the local machine to use those `our-web-server` as additional private key beside our default `id_rsa` file\n\n- _How to fix_: we need to use `ssh-add` command to add that private key file `our-web-server` into our authentication agent, and make the agent recognize our file as private key and should send it for authentication. The syntax is `ssh-add <path_to_private_key>`.\n\n  In our case, we need to run\n\n  ```bash\n  ssh-add ~/.ssh/our-web-server\n  ```\n\n### Error: `Error connecting to agent: No such file or directory`\n\n---\n\n[Wiki page explain `ssh-agent`](https://en.wikipedia.org/wiki/Ssh-agent)\n\n[StackOverflow on the error](https://stackoverflow.com/questions/52113738/starting-ssh-agent-on-windows-10-fails-unable-to-start-ssh-agent-service-erro)\n\n- _Description_: when we try to run `ssh-add` in the attempt to solve the above error, or just try to run `ssh-add` alone, this error message pop up\n\n- _Reason_: this happens because we cannot access the agent that manage private keys. This agent is the authentication agent that deal with private key and its passphrase. By default, in Windows, this agent is disabled.\n\n- _How to fix_:\n\n  1. Check whether this authentication service is working or not by running below command on **Powershell**\n\n     ```powershell\n       Get-Service ssh-agent | Select StartType\n\n       StartType\n       ---------\n       Disabled\n     ```\n\n  2. If the agent is disabled, then set up to start the agent manually by running\n\n     ```powershell\n     Set-Service ssh-agent -StartupType Manual\n     ```\n\n  3. Then we can actually start the agent by running `Start-Service ssh-agent` or just `ssh-agent.exe`\n\n---> Note that these action will require Adminstration authorization on Powershell\n\n**Why doesn't `/ssh` just use all key file inside it instead of making us manually adding those key?**\n\n[From a Superuser answer](https://superuser.com/questions/360686/what-exactly-does-ssh-add-do)\n\n> `ssh` does use the key in the `~/.ssh` directory, but if the key is protected by a passphrase, this passphrase must be entered at some point. If you use `ssh-agent` and `ssh-add`, you type this passphrase once. Otherwise you must type the passphrase each time you use ssh. Note that if the key is not password protected, you can use ssh without being asked for a passphrase.\n\n## Resources\n\n- [Traversy Media - SSH Crash Course | With Some DevOps](https://www.youtube.com/watch?v=hQWRp-FdTpc)\n",
      slug: "how-to-authenticate-with-a-linux-machine-remotely",
      description:
        "To start using a remote machine, we need to get access to it. But there is more than one way to access it. Let figure out how. ",
      created_at: "2021-08-28T03:50:38.786Z",
      updated_at: "2021-08-28T03:50:41.515Z",
    },
  ];

  const files = await readdir(path.join(process.cwd(), "content"));

  for (const fileName of files) {
    const file = await readFile(
      path.join(process.cwd(), `content/${fileName}`),
      "ascii"
    );

    console.log(getTitle(file));
  }

  return {
    props: { posts: posts.map((post) => formatPostTime(post)) },
  };
};
