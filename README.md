## Inspiration
The inspiration behind our app came from a deep desire to help people suffering from Motor Neuron Disease and other debilitating health conditions that make it difficult or impossible for them to communicate effectively. 

We realized that there was a pressing need for an accessible, inexpensive, and non-invasive solution to help these individuals communicate effectively with others. 

Our goal was to create a tool that would empower these patients, giving them a voice and a means to express themselves with ease.

## What it does
Our app functions as an intelligent on-screen keyboard that can be controlled with the user's eyes. By utilizing state of the art eye-tracking technology, the app allows anyone to be able to type words and sentences without the need for physical touch or speech. The keyboard is designed with a predictive text feature that suggests words based on the user's key inputs, reducing the effort required for typing and speeding up communication.

## How we built it
Building the app involved a combination of cutting-edge technologies and extensive research into user-friendly design. We followed the implementation of a [SOTA research paper](https://rikky0611.github.io/resource/paper/rgbdgaze_icmi2022_paper.pdf) to develop a relatively accurate eye-tracking system. 

The user interface was designed with accessibility in mind, incorporating large keys, high contrast colors, and an intuitive layout. Our interdisciplinary team of 2 developers and a designer worked closely together to ensure that the app would be both functional and easy to use for patients with various needs and abilities.

## Challenges we ran into
Challenges we encountered during the development process included finding the best algorithm for gaze estimations to some position on a screen (choice between iris-to-screen projections and CNNs), optimizing the eye-tracking algorithm for accuracy and speed, as well as ensuring compatibility across different devices and screen sizes. We also had to strike a balance between the complexity of the app's features and the simplicity of its design, keeping in mind the unique needs and limitations of our target users.

## Accomplishments that we're proud of
Being able to implement the research paper's gaze tracking algorithm and being able to repeat the results of the research paper.

Reconstructing a T9 keyboard.

Having a very nicely designed website (from a first time hackathon attendee!).

## What we learned
We learned many as individuals and as a team:
- Various gaze tracking solutions and technologies
- ML and computer vision frameworks such as CNNs, PyTorch, Tensorflow, OpenCV
- HTML and CSS frameworks such as Bootstrap
- Advanced Javascript functionalities

## What's next for EyeType
As for the future of our app, we plan to continue refining and expanding its capabilities. Potential updates include adding more languages, incorporating customizable user profiles, and integrating the app with other communication platforms such as social media and email. Furthermore, a large language model could be used to make the predictions more accurate and contextual and the eye detection algorithm could be further developed for even higher accuracy.
