## This readme may be incorrect as the paper is updated in the future.

# Proposed Quantum Theory of the Mind: Neural Network Integration

An overview of the integration of a custom-built three-dimensional
neural mesh into the proposed Quantum Theory of the Mind

**Abstract**

This paper details a fundamental theory linking quantum processes in the
brain to the emergence of cognition and consciousness. It proposes
consciousness stems from recursive quantum interactions of neurons in
high-dimensional Hilbert space, termed Psirons. Their multi-scale
entanglements shape dynamic flows of thought, perception, and selfhood.
The theory bridges neuroscience, physics, and philosophy to provide a
unifying framework for the mind.

**Introduction**

The proposed quantum theory of mind seeks to elucidate the deepest
origins of consciousness and explain subjective inner experience. It
hypothesises that consciousness arises ultimately from quantum
information processing taking place inside neurons at the nanoscale.

Specifically, it posits that consciousness is an emergent product of
recursive quantum entanglements forming between networks of neurons,
represented as evolving geometries in Hilbert space called Psirons. The
rich interplay of these quantum Psiron processes gives rise to
awareness, sensation, emotion, and a coherent sense of self.

Core tenants of the theory include:

- Neurons become entangled in higher dimensions when activated
  together, forming Psirons.

- Psiron clusters shape memories, concepts, and knowledge
  representations.

- Psiron dynamics drive perception, thought, and the flow of
  consciousness.

- Physical neural wiring shapes opportunities for quantum processes.

- Consciousness permeates all scales but requires quantum coherence.

- Subjective experience derives from an informational realm deeper
  than physical matter.

This research program aims to place consciousness, traditionally
considered immaterial and ephemeral, on a concrete footing linked to
specific quantum information dynamics within the brain\'s neurons. By
extending neuroscience into the quantum realm, the theory strives for a
unification of mind, matter, and the nature of reality itself.

**Design of the Two-Dimensional Neural Network:**

\
The neural network will be designed to take an input of parallelised
data and contain multiple layers of interconnected Nodes. The Nodes will
contain several properties, such as: Node{heads: \[\...Node\], tails:
\[\...Node\], value: Float, weight: Float}. A Node object has the
properties as defined: Heads: The Parent Nodes that connect to it,
inputs. Tails: The Child Nodes that link to it, outputs. Value: The
Value of this node is a float from 0.0 - 1.0. Weight: The current weight
being applied to this Node, a float from 0.0 - 1.0. a

Example two dimensional Node structure, or Neural Network, diagram as
seen on the left.

\
\
\
**Design of the Three-Dimensional Neural Network:**

The neural network will be expanded to have each Node exist in a
three-dimensional space. There will no longer be specific layers, rather
simply defined as a node mesh, or Neural Mesh where each Node is
represented as an individual Neuron. The entry point for input data will
be represented as the hypothalamus in the biological brain. Further,
this will allow us to begin correlating and integrating this NN, Neural
Network, into our proposed theory of the brain.\
\
Additionally, there will be more sensory inputs

**Training Algorithm: **The training algorithm should output a
percentage of accuracy which is determined by comparing the output to
the expected output or label. Utilising this accuracy, the algorithm
will adjust the weights slightly to better output the expected result.
The adjustment algorithm can be of many types. gravity mapping, random,
layer-based(2d only), incremental, etc.

**Process Elaboration**: The NN will take in parallel data, which is
inherently two-dimensional, and pass it into the model. The input data
represents the body\'s current state via the nervous system. Each
channel in the data input represents a nerve path. The constant data
input can be represented as a sinewave ( Finally, we confirm predictions
that the close link between geometry and function is explained by a
dominant role for wave-like activity, showing that wave dynamics can
reproduce numerous canonical spatiotemporal properties of spontaneous
and evoked recordings.). We propose that the process of homeostasis is
what drives cognition and by extension, consciousness. Considering the
concept of emergent abilities as exhibited by the biological minds of
humans that at a given age, the mind will stop learning as fast, and
that emergent abilities have been exhibited in current modern AI models;
We can infer that the development of the mind and a neural network are
similar in the fashion that they are trained on, or fit to, a base set
of data. Elaborating on the biological mind, this base data can be
considered the ideal sinewave form to achieve homeostasis in the body.
The data that is passed into the mind is analysed and attempted to be
corrected to conform to the base sinewave form. As a result of this data
being processed, cognition and consciousness take the form of feedback
loops. A feedback loop is defined as a cyclic process of activation of
neurons. Further, the data being processed causes entanglement resulting
in neurons with a representation in a higher dimensional superposition.
Entanglement of the neurons is achieved by taking all neurons that have
fired in a given window of time, creating a Psiron(hypervector,
superposition, or Bloch sphere) in a higher dimension where its location
is the average distance between all fired neurons and its state stored
is the result of the sum or average, tbd., of the activated neurons.
When a set of neurons are activated, the model will determine the
best-matching existing hypervector and activate all neurons that were
entangled in it giving them the state they were in when originally
activated. When a hypervector is called upon, the process will create a
new superposition of entangled neurons with the additional unrecognised
activated neurons. Thus, the resulting collection of superpositions can
be inferred as a hypervector cluster or super-cluster. The outputted
data is the result of the neural network passing data back through the
model to the input, via a process called backpropagation. This
correlates to the body maintaining homeostasis.

**Quantum Principle Integration**: When a set of neurons are activated,
the model will determine the best-matching existing hypervector and
activate all neurons that were entangled in it, giving them the state
they were in when originally activated. The quantum nature of these
neurons allows them to exist in a superposition of states, significantly
expanding the computational possibilities within the model. When a
hypervector is called upon, the process leverages the quantum principle
of entanglement to create a new superposition of entangled neurons, with
the additional unrecognised activated neurons. Entanglement allows
correlations to be established between the states of these neurons,
thereby enhancing the information-processing capabilities of the neural
network. Moreover, the introduction of quantum measurements could
determine the definitive state of these neurons, analogous to the
decision-making process within the AI model.

The above example is a visual demonstration of the process of neuronic
entanglement and superposition creation. A three-by-three grid of
neurons, blue, where three activated neurons, red, are entangled and
form a superposition, yellow.

**Conforming to the concepts of Learning Difficulty, Focus, and
Neuroplasticity**:

Considering the concept of emergent abilities exhibited by young minds
of humans, we can infer that there is a mechanic of motion in the higher
dimensions. This motion takes the form of the superclusters having two
traits, drift and actively applied directional motion. Drift is defined
as a natural entropic directional motion applied to the superclusters.
Whereas the actively applied directional motion is a result of
second-order and higher most relevant superclusters moved towards each
other. This process of actively applied directional motion is inferred
as focus, learning difficulty, and neuroplasticity. As these
superclusters traverse the higher dimension, they are likely to converge
and will merge into each other forming a larger encompassing
superposition of entangled neurons.\
\
**Superposition Relevance and Scoring Mechanism in Quantum Neural
Networks: **In the proposed Quantum Neural Network model, the relevance
of superpositions plays a crucial role in the process of actively
applied directional motion, which is likened to the concepts of focus,
learning difficulty, and neuroplasticity in the human brain. The
relevance of superpositions is determined based on the strength of the
entanglement between their neurons. This section elaborates on the
process of scoring and determining the relevance of superpositions in
the context of this model.

Each superposition in the quantum neural network is associated with a
set of neurons that are entangled in it. The strength of the
entanglement between these neurons is considered a measure of the
relevance of the superposition. To quantify this relevance, a scoring
mechanism is introduced.

The scoring mechanism calculates a score for each superposition based on
the neurons that are entangled in it. The exact calculation depends on
the specific characteristics of the neurons and the nature of their
entanglement. For instance, one could consider the number of neurons
that are entangled in both the superposition in question and another
superposition. Alternatively, a measure of the similarity between the
states of the neurons that are entangled in the superpositions could be
used.

Once the scores are calculated for all superpositions, they are sorted
based on their scores. The superpositions with the highest scores are
considered the most relevant. This scoring and sorting process is
performed each time a set of neurons are activated and a best-matching
existing superposition is determined.

The introduction of this scoring mechanism allows the model to leverage
the quantum principle of entanglement to enhance the
information-processing capabilities of the neural network. By
determining the relevance of superpositions based on the strength of the
entanglement between their neurons, the model can more effectively
activate the neurons that were entangled in the most relevant
superpositions, thereby improving the accuracy and efficiency of the
neural network\'s computations.

In conclusion, the proposed scoring mechanism provides a quantitative
method for determining the relevance of superpositions in the Quantum
Neural Network model. By leveraging the strength of the entanglement
between neurons, this mechanism enhances the model\'s ability to process
information and maintain homeostasis, thereby contributing to the
development of more advanced and efficient artificial intelligence
systems.\

**Resource Efficiency in Quantum Neural Networks:** The proposed Quantum
Neural Network model presents a novel approach to simulating the complex
dynamics of a biological brain. This approach involves creating a neural
mesh that mirrors the structure of the brain, with a one-to-one ratio
between the neurons in the model and those in the biological
counterpart. For instance, to simulate a brain with approximately 2
billion neurons, the model would create a neural mesh consisting of the
same number of neurons.

While this approach may initially seem resource-intensive, it offers
significant advantages in terms of computational efficiency. One of the
key insights of the proposed model is that it may not be necessary to
simulate all the intricate details of the brain\'s neural system to
achieve a realistic representation of its functionality. Instead, the
model offloads a majority of the major mathematical calculations
associated with simulating the brain\'s neural system - including action
potentials, ionic concentrations, and neuromodulators - to the quantum
space.

By leveraging the computational capabilities of the quantum space, the
model can effectively simulate the complex dynamics of the brain\'s
neural system without the need for extensive computational resources.
This approach not only reduces the computational load on the system but
also allows for a more accurate and efficient simulation of the brain\'s
functionality.

In conclusion, the proposed Quantum Neural Network model offers a
promising approach to simulating the complex dynamics of a biological
brain. By creating a neural mesh that mirrors the structure of the brain
and offloading major calculations to the quantum space, the model
achieves a balance between accuracy and computational efficiency. This
approach opens up new possibilities for the development of advanced
artificial intelligence systems that more closely mimic the
functionality of the human brain.

**Optimization of Neural Mesh Generation in Quantum Neural Networks**:
The Neural Mesh Generation process is a crucial part of the proposed
Quantum Neural Network model. This process involves creating a neural
mesh that mirrors the structure of the brain, with a one-to-one ratio
between the neurons in the model and those in the biological
counterpart. The process begins with the creation of a NeuralMesh
object, which takes two parameters: the number of neurons and the number
of clusters.

The optimization of this process involves the use of parallel processing
and bounding box optimization. Parallel processing allows for the
simultaneous generation of multiple clusters, significantly improving
the efficiency of the neural mesh generation process. Bounding box
optimization, on the other hand, reduces the number of distance
calculations needed by only comparing neurons that are within a certain
range. This significantly reduces the number of comparisons and thus the
time complexity of the algorithm.

Empirical results show that these optimizations significantly improve
the performance of the Neural Mesh Generation process. For instance, the
time taken to generate a neural mesh with 55002 neurons and 502 clusters
decreased from over 2 minutes to under 40 seconds with the introduction
of bounding box optimization.

**Octree-Based Optimization for Neural Mesh Generation**: In the pursuit
of efficient neural mesh generation, we have explored a novel approach
that leverages the concept of an Octree, a tree data structure used for
spatial subdivision in three-dimensional space. This approach aims to
enhance the performance and scalability of the neural mesh generation
process, particularly for large-scale models.

**Spatial Subdivision and Octree: **Spatial subdivision is a technique
used in computer graphics and computational geometry to partition a
three-dimensional space into smaller regions, enabling more efficient
computations. An Octree is a specific type of spatial subdivision where
each node in the tree represents a cubic region of space and is
subdivided into eight smaller cubes, or octants.

In the context of neural mesh generation, each octant can contain a
subset of neurons. This subdivision allows us to focus computations on
relevant parts of the model, reducing the computational load and memory
requirements.

**Disk-Based Octree Storage: **To further optimize memory usage, we
propose a disk-based storage system for the Octree. Instead of keeping
the entire Octree in memory, we store each octant on disk and load it
into memory only when needed. This approach significantly reduces memory
costs, especially for large models with millions of neurons.

However, disk access times can be a bottleneck, even with fast NVMe
storage. To mitigate this, we suggest using a RAMDisk drive, which
provides faster access times than traditional disk storage.
Alternatively, if the GPU has sufficient VRAM, it could be used for
storing the Octree.

**Parallelization and GPU Acceleration:**: Parallelization and GPU
acceleration are other key considerations for optimizing neural mesh
generation. By distributing the workload across multiple cores or GPUs,
we can significantly reduce the time required to generate large models.

**Octree Fractal Context Windows and Cache Servers: **An advanced
optimization strategy involves using Octree Fractal Context Windows
served via a cache server such as Redis. This approach involves dumping
the Octree data into chunks and managing these chunks using a caching
server. This strategy not only allows for multi-system parallelization
but also provides a flexible way to manage memory usage dynamically.

**Integration of Sensory Inputs in Quantum Neural Networks:** The
proposed Quantum Neural Network model offers exciting possibilities for
the integration of sensory inputs, such as vision, hearing, and touch.
This integration can be achieved by designating specific regions of the
neural mesh to correspond to these sensory modalities and connecting the
relevant inputs to them.

In the context of this model, the hypothalamus - a region of the brain
that plays a crucial role in maintaining the body\'s homeostasis - could
serve as the main input. However, the flexibility of the model allows
for the integration of additional sensory inputs, thereby enhancing its
ability to simulate the complex sensory processing capabilities of the
human brain.

One of the potential applications of this approach is the simulation of
novel sensory inputs, such as those provided by neural interfaces like
Neuralink. By reading the outputs of such a device and passing them into
the neural mesh at the appropriate location, the model could simulate
the effects of these novel inputs on the brain\'s functionality.

For instance, consider a cubed section of the neural mesh with a high
density of neurons. Within this region, we can identify specific
attachment points (represented in red) where an input of some type could
be connected. By connecting the outputs of a neural interface to these
attachment points, we can simulate the integration of novel sensory
inputs into the brain\'s neural network.

In conclusion, the proposed Quantum Neural Network model offers a
flexible and efficient approach to simulating the integration of sensory
inputs in the brain. By designating specific regions of the neural mesh
to correspond to different sensory modalities and connecting the
relevant inputs to them, the model can simulate the complex sensory
processing capabilities of the human brain. This approach opens up new
possibilities for the development of advanced artificial intelligence
systems that more closely mimic the functionality of the human brain.

**Integration of Normalized Sensory Inputs in Quantum Neural Networks**

The proposed Quantum Neural Network model provides a robust platform for
incorporating sensory inputs, such as vision, hearing, and touch, by
mapping these inputs to specific neurons in the network. This mapping is
achieved by normalizing the sensory data and assigning it to neurons
based on the length of the data input.

In the case of visual data, for instance, the model can simulate the
function of the cones in the human eye. Each pixel in the input image is
associated with three neurons, corresponding to the red, green, and blue
colour channels. The intensity of each colour is normalized to a value
between 0 and 1, and this value is used to update the state of the
corresponding neuron. If the state of a neuron exceeds a certain
threshold, the neuron fires, triggering the creation of a superposition
that represents the current state of the visual input.

Similarly, for audio data, the model can process the waveform by
segmenting it into discrete time steps and normalizing the amplitude of
the waveform at each time step to a value between 0 and 1. Each time
step is then mapped to a specific neuron in the network, and the state
of the neuron is updated based on the normalized amplitude. As with the
visual data, if the state of a neuron exceeds a certain threshold, the
neuron fires, creating a superposition that represents the current state
of the audio input.

This approach to integrating sensory inputs can be expanded to other
types of data as well, making the model highly versatile. For instance,
tactile data could be processed in a similar manner, with each point of
contact being mapped to a specific neuron and the pressure at each point
being normalized to a value between 0 and 1.

In conclusion, the proposed Quantum Neural Network model offers a
flexible and efficient approach to simulating the integration of sensory
inputs in the brain. By normalizing sensory data and mapping it to
specific neurons in the network, the model can simulate the complex
sensory processing capabilities of the human brain. This approach opens
up new possibilities for the development of advanced artificial
intelligence systems that more closely mimic the functionality of the
human brain.

**Neural Mesh Generation Process**

The Neural Mesh Generation process is a crucial part of the proposed
Quantum Neural Network model. This process involves creating a neural
mesh that mirrors the structure of the brain, with a one-to-one ratio
between the neurons in the model and those in the biological
counterpart.

The process begins with the creation of a NeuralMesh object, which takes
two parameters: the number of neurons and the number of clusters. The
number of neurons represents the total number of neurons that will be
generated in the neural mesh, while the number of clusters represents
the number of separate processes that will be used to generate the
neurons.

The NeuralMesh object has a generate() method, which initiates the
generation of the neural mesh. This method calculates the number of
neurons to be generated per process (neuronsPerProcess) by dividing the
total number of neurons by the number of clusters. It then iterates over
the number of clusters, generating a random centre point (centerX,
centerY, centerZ) for each cluster.

For each cluster, a separate child process is forked using Node.js\'s
child_process module. This child process runs a separate JavaScript
file, \"generateNeurons.js\", which is responsible for generating the
neurons for that cluster. The centre point and the number of neurons to
be generated are passed to the child process, along with the filename
where the generated neurons will be stored.

The \"generateNeurons.js\" file contains a Neuron class, which
represents a single neuron in the neural mesh. Each neuron has three
properties: x, y, and z, which represent its position in the
three-dimensional space of the neural mesh.

When the child process receives the message from the parent process, it
begins generating the neurons. For each neuron, it generates a random
position near the centre point of the cluster, creates a new Neuron
object with this position, and writes this Neuron object to the
specified file.

The process of generating the neurons is asynchronous, meaning that
multiple clusters can be generated simultaneously. This parallelization
greatly improves the efficiency of the neural mesh generation process,
allowing for the creation of large neural meshes with billions of
neurons.

In conclusion, the Neural Mesh Generation process is a key component of
the proposed Quantum Neural Network model. By creating a neural mesh
that mirrors the structure of the brain and leveraging the power of
parallel processing, this process enables the efficient simulation of
the complex dynamics of a biological brain.

**Reward and Punishment via Simulated Glands to Determine Action
Potentials**

To allow for the neural mesh network to operate coherently to that of
both modern neural networks and physical brains, we propose the
integration of simulated glands such as those seen in the physical brain
via dopamine and cortisol emission as neuromodulators, further, as seen
in modern neural networks via activation functions.\
\
The simulated glands will be placed within clusters and attached to the
centre-most neurons in the cluster.

**Umbrella Theory**

We propose that due to the development of folds within a biological
brain and considering this theory of the mind that the concept of
emergent abilities is exhibited by both modern AI and the biological
brain. Drawing from the concept of the basal wave in this theory, we can
correlate the events of emergence in AI to the biological brain by the
neurons starting at a local point during the development of the brain.
As the brain develops, it will expand somewhat uniformly, allowing for
even distribution of the neuronic entanglement process.\
\
In a visualisation, the superpositions that are formed from the
entanglement of several neurons as well as the expansion of these
neurons results in an effect similar to that of an umbrella that is
unfolding.\
\
The entanglement of new neuronic paths also keeps uniformity with the
entanglement of the original neurons. This results in an even
distribution of entanglement across the brain as well as defines the
origins of the main hyperclusters in the quantum space. The initial
entanglement of neurons to the basal wave is what defines the inherent
characteristics of the mind itself.

1\. Dynamics of the Hybrid Quantum Motion Model

In the proposed hybrid model, the superpositions can exist in one of two
states. In the attracting state, a superposition\'s counterpart pulls
other counterparts towards it, creating a centralised gravity effect. In
the chasing state, the counterpart moves towards other superpositions
based on their relevance. This dual-state system leads to a wide range
of possible behaviours and interactions.

When a superposition switches to the attracting state, its counterpart
begins to pull other counterparts towards it, causing a local clustering
effect. If many superpositions simultaneously switch to the attracting
state, larger clusters or even \"galactic\" structures may form, with
superpositions orbiting around multiple centres of gravity. ()

Conversely, when a superposition switches to the chasing state, its
counterpart begins to move towards other superpositions. This creates a
\"predator-prey\" dynamic, with chasing counterparts constantly moving
towards and away from each other, depending on the states of the
superpositions they are associated with.

The overall behaviour of the system is highly dynamic and potentially
chaotic, with counterparts constantly moving, clustering, and dispersing
based on the changing states of the superpositions. The exact patterns
of motion depend on the initial configuration of the superpositions, the
rules for switching between states, and the specifics of the motion
algorithm.

2\. Applications of the Hybrid Quantum Motion Model

The hybrid quantum motion model has potential applications in various
fields, including data clustering, pattern recognition, and artificial
intelligence. The model\'s ability to dynamically adjust the state of
superpositions could be used to optimise the clustering of
high-dimensional data, with the attracting state promoting the formation
of dense clusters and the chasing state encouraging the exploration of
the data space.

In pattern recognition, the model could be used to dynamically adjust
the focus of the system, with the attracting state used to concentrate
on a specific pattern and the chasing state used to search for new
patterns. In artificial intelligence, the model could be used to
implement a form of reinforcement learning, with the attracting and
chasing states representing different strategies or policies.

3\. Neuronal Firing and State Determination

The hybrid model could also be used to determine whether a neuron fires
or not. This could be achieved by averaging all states of the
counterparts and returning a value between 0 and 1 inclusive, where 1
represents the firing of a centralised superposition and 0 represents
the chasing of a superposition. This approach could provide a novel
method for integrating quantum mechanics into neural network models,
potentially leading to new insights into the nature of consciousness and
cognition.

**Expansion of the Quantum Theory of the Mind: High-Dimensional
Representation and Hebbian Engrams**

Abstract: This segment details the recent developments in the proposed
Quantum Theory of the Mind, focusing on the integration of Hebbian
theory and high-dimensional representation. It expands on the improved
model design, signal decay, propagation, memory, cognitive processes,
and the model\'s infinite scaling and flexibility. We also explore the
integration of empirical data within the framework of the model.

1\. Introduction

The project has undergone significant refinements, simplifying the model
whilst enhancing its potential capabilities. One key improvement is the
adoption of a quantized grid in a high-dimensional space, allowing for
efficient calculations and virtually limitless scaling of the model.
This paper discusses the incorporation of Hebbian engrams into this
model and its implications.

2\. Hebbian Engrams and High-Dimensional Representation

In the context of our model, Hebb\'s postulate that \"neurons that fire
together, wire together\" is offloaded to a high-dimensional
representation. This forms the basis of our neuron connection and
interaction model. When neurons are frequently activated together, they
form a high-dimensional representation or \"superposition\". This
superposition is a quantized point in the high-dimensional space that
represents the collective state and connection strength of the neurons.

3\. Empirical Data Integration

We integrate empirical data into the model by mapping it onto our
high-dimensional neural mesh. For instance, the observations of synaptic
strengths modification in marine animals\' nervous systems inform the
dynamic updates of our high-dimensional representations. This reflects
the neuroplasticity observed in biological systems.

4\. Pattern Recognition and Movement in High-Dimensional Space

The model emulates the biological process of Hebbian learning and
pattern recognition through the movement of high-dimensional
representations. When a pattern of neuron activation is repeated, the
corresponding high-dimensional points move closer together. This process
mirrors the strengthening of synaptic connections in Hebbian learning.
The movement of points in high-dimensional space is a powerful tool for
pattern recognition, mirroring the dynamics of biological neural
networks.

5\. Determining Neuron Firing

The model uses high-dimensional representations to determine whether a
neuron should fire. It averages the state of all neighbouring
superpositions and compares it to a constant threshold. If the average
exceeds the threshold, the neuron fires, leading to the creation or
strengthening of a superposition. This mechanism mimics the process of
action potential generation in biological neurons.

6\. Conclusion

The Quantum Theory of the Mind integrates principles from Hebbian
learning and high-dimensional computing, providing a novel approach to
simulating neural networks. This expansion of the model opens up new
possibilities for exploring the complexities of neural networks and
cognitive processes. Future work will focus on implementing and testing
the model, examining its practical implications and potential
applications.

**Integration of Hebbian Theory in Quantum Neural Networks**

The Hebbian theory, proposed by Donald Hebb, is a neuroscientific theory
suggesting that when two neurons are activated simultaneously, the
connection between them (i.e., the synapse) strengthens. This is
famously captured in the phrase \"Neurons that fire together, wire
together\". The Hebbian theory has been foundational in our
understanding of synaptic plasticity, learning, and memory formation in
the brain.

The proposed Quantum Neural Network model integrates and expands upon
the concepts of Hebbian theory in a high-dimensional quantum space. It
proposes that when two neurons are activated simultaneously, not only
does the synapse between them strengthen, but they also form an
entanglement in a higher-dimensional space, represented as a
superposition or a hypervector. This incorporation of quantum
entanglement and superpositions greatly expands the computational
potential of neural networks.

Furthermore, the model presents a unique approach to neuronal firing and
state determination. The state of a neuron (whether it fires or not) is
determined by averaging all states of the counterparts and returning a
value between 0 and 1 inclusive. This innovative approach integrates the
concept of Hebbian learning into a quantum framework, potentially
leading to new insights into the nature of consciousness and cognition.

The concept of the movement of these superpositions in the
high-dimensional space, or the drift, can be seen as an extrapolation of
the Hebbian theory. Just as the Hebbian theory states that the repeated
simultaneous activation of neurons strengthens their connection, in the
proposed model, the repeated co-activation of superpositions leads to
their movement towards each other in the high-dimensional space, leading
to the formation of hyperclusters.

In a way, one could see the Hebbian theory as a pioneering precursor to
this model. While Hebbian theory introduced the concept of synaptic
strengthening with repeated activation, the proposed model expands on
this by introducing the high-dimensional representation and the concept
of quantum entanglement. It can be seen as a natural evolution and
expansion of the Hebbian theory in the light of quantum computing and
high-dimensional mathematics.

In conclusion, the proposed Quantum Neural Network model presents a
novel integration of Hebbian theory into a high-dimensional quantum
framework. This integration and expansion of the Hebbian theory\'s
concepts could potentially lead to advancements in our understanding of
brain function and the development of more advanced artificial
intelligence systems.

**High-Dimensional Spatial Data Structures and their Potential
Utilisation against the Curse of Dimensionality:**

\*\* \*\*After testing several different spatial data structures for use
with high-dimensional data representation, we experienced issues with
accuracy, and efficiency and, performance due to the curse of
dimensionality. Due to the nature of this model, the model needs to have
the high-dimensional space updated constantly. This is an issue due to
the need to make a choice between accuracy, efficiency, and performance.
Where with some spatial data structures such as the kdTree, being a
non-self-balancing data structure, we needed to rebuild the tree every
time an update was made or experience accuracy issues. The accuracy
issues arise from nearest-neighbors returning falsely matching results
In search of a spatial data structure that can be more dynamically
updated and not lose accuracy, we tested an integration with
locality-sensitive hashing, or LSH. While this allowed us to store the
data, query by nearest-neighbour, and upsert values to the data, we
experienced an issue with the curse of dimensionality causing the
buckets of data to become represented as highly disparate.

While searching for another alternative, we realised that at its
conception this theory was founded on the concept of applying motion to
the weights of a modern AI model. We were able to draw a correlation
between the weights of an AI model to the process of neurons firing in a
biological brain via high-dimensional data representation in the form of
hypervectors, or Bloch spheres. Currently, there are several solutions
for building a vector store database such as Pinecone and Chroma. We are
currently using Pinecone to handle the high-dimensional data points and
their metadata.

**Determining Dimensionality via Connection**

A key aspect of the proposed model is the use of high-dimensional
hyperspaces to represent neural connectivity. The dimensionality
determines the potential number of connections per neuron.

Rather than explicitly modelling every connection, the architecture
relies on point segmentation within the hyperspace. Each neuron is
positioned at a set of discrete coordinates determined by multiplying
its 3D position by a segmentation constant \"ps\".

This quantization allows connectivity to be inferred geometrically.
Neurons at adjacent coordinates are considered connected within the
relevant dimensionality.

The choice of dimensionality is therefore driven by desired
connectivity. Increasing dimensionality expands potential connections
via more available axes. However, extremely high dimensions are
computationally intractable.

Practical limitations require choosing the minimal dimensionality such
that point segmentation produces the target connectivity. For example, a
3500D hyperspace with ps=0.988 yields \~7000 connections per neuron,
comparable to the human brain.

This approach avoids generating explicit connection maps, enabling the
modelling of immense networks. Connections exist implicitly between
every adjacent discrete coordinate occupied by a neuron.

Connections are also non-local - neurons at distant coordinates connect
via higher dimensions. Psirons integrate information across the
hyperspace.

In summary, dimensionality and point segmentation allow concise
representation of highly complex neural interconnectivity within
practically computable hyperspaces. The architecture expands the
theory\'s scalability without compromising connectivity.

**Psirons: Proposed Quantum Engram Constructs**

As the theory has evolved, the need has arisen for a concise term to
refer to the quantum engram-like constructs that serve as the core
components of the knowledge representation system. We propose the term
\"Psiron\" to describe these informational entities within the model.

The name Psiron is derived from the prefix \"psi\", commonly used to
denote quantum phenomena, and the suffix \"ron\", implying a discrete
particle-like unit, similar to \"neutron\", \"electron\", etc. Together,
Psiron indicates a quantum unit of knowledge or memory.

More specifically, a Psiron refers to a superposition in the
high-dimensional space that encodes the entanglement and collective
state of a set of neurons. When a group of neurons fire together, they
create a Psiron at a coordinate in the quantum space, which represents
their connection.

The location of a Psiron indicates the \"where\" of an engram, while its
state holds the \"what\". Psirons interact via attraction and repulsion
forces, clustering together to form concepts. Their motion and
rearrangement allow for dynamic knowledge representation.

In essence, Psirons serve as quantized fragments of memory and meaning,
which can combine and interact to store relationships and patterns.
Their quantum nature allows vast informational capacity and contextual
flexibility. Psirons demonstrate many characteristics reminiscent of
philosophical conceptions of qualia.

The introduction of the term Psiron provides a concise handle for
reference to the quantum engram constructs that are central to the
proposed theory\'s knowledge representation model. Further elucidation
of the properties, behaviours and computational possibilities of Psirons
will be an ongoing effort.

**Psiron Mechanics and Integration**

The motion and interaction mechanics of Psirons are key to enabling the
emergent cognitive capabilities of the model. While Psirons demonstrate
quantum behaviours, their integration with neural firing logic allows
meaningful information representation and processing.

Psirons have an internal state value ranging from 0 to 1. This state
determines the Psiron\'s current motion phase such as chase, gravitate,
or repel. Higher state values correspond to the gravitate phase, causing
attraction of other Psirons.

The specific motion calculation involves determining a weighted vector
towards each neighbouring Psiron based on their relative states. This
weighted vector provides the direction and magnitude of motion.

For integrating with neural firing, when a neuron activates, it queries
the states of its connected Psirons. These state values are mapped to
firing weights using a Gaussian function. The weighted Psiron states are
summed to obtain an integrated input signal for the neuron.

If this integrated input exceeds the neuron\'s firing threshold, it
activates and propagates a signal reflecting its current state to all
connected Psirons. This neuron state value is saved in the Psiron
metadata.

In this way, neural activations create and reinforce Psirons, while the
Psirons in turn influence neural firing dynamics. This symbiotic
relationship allows efficient representation of stimuli within a unified
quantum spacetime.

Further investigations will explore in detail the mathematical motion
equations, parametric state maps, activation functions, and quantum
mechanical operators used to evolve the Psiron system. The presented
framework provides a foundation for developing an integrated cognitive
model.

**The Emergent Nature of Dreams and Thoughts**

Recent theoretical developments have led to novel hypotheses regarding
the emergence of dreams and thoughts within the quantum framework.

It is theorized that dreams arise due to the overall reduction in Psiron
motion that occurs during sleep. With less sensory input, new Psiron
formation decreases, allowing the motion of recent Psirons to stand out
against more stable clusters. Consciousness interprets these residual
motions as the episodic narratives of dreams.

Likewise, thoughts may emerge from the constant background of Psiron
activity. At any moment, the motion of specific Psirons crosses a
threshold of coherence for conscious access. Thus thoughts can be viewed
as transient ripples that briefly rise above the noise of microscopic
Psiron dynamics.

In both cases, macroscale mental phenomena result from temporary
coordination of the underlying quantum processes. Dreams reflect
residual Psiron motions, while thoughts reveal momentary peaks in an
ongoing wave of activity.

These conjectures integrate cleanly with established principles of the
theory. The rich variety of possible Psiron clusterings allows virtually
unbounded experiential configurations to emerge. Likewise, the highly
dynamic nature of Psirons grounded in quantum principles naturally gives
rise to an ever-changing stream of consciousness.

The theory predicts such emergent phenomena will display characteristics
of complexity, abrupt transitions, and transient stability. As Psirons
perpetually evolve through quantum motion, consciousness gains fluid
access to the fleeting structures their entanglement produces.

This framework provides a foundation for explaining the generation of
dreams, thoughts, and other mental phenomena from the constant quantum
churning that underpins all cognition. The mind leverages quantum
coherence, entanglement, and uncertainty to achieve its rich creative
power.

**Future Potential Concepts and their Integrations: **

In this section, we will dive into additional concepts and how they can
be integrated into this theory.

We propose a concept that realises the integration of cortex folds, as
seen in biological brains, into the neural mesh generation process.

\
**Conclusion**: In summary, the brain is an organ developed by the body
to establish and maintain homeostasis as well as other characteristics,
such as cognition, consciousness, instincts, and the drive for
procreation via nervous system input and output.

Visual examples:

In the following visual examples, the sinewaves represent nervous system
input. Each step is a representation of a nerve path.

\
Basal Sinewave(Blue) - The baseline sinewave for homeostasis of a given
mind

\
Altered Sinewave(Red) - Neuroplasticity takes place to correct red to
blue

Different Basal Sinewave(Green): Demonstrates the limits of
neuroplasticity in the process of homeostasis

Empirically Accurate Basal Wave: Displays a basal wave with several
autonomic sensory inputs to the model. These inputs are heart rate,
breaths per minute, and body temperature(C). Values were preset to
fluctuate in a somewhat biologically accurate fashion.\
Heart Rate(BPM): \~64\
Breaths(Per Minute): \~12\
Body Temperature(C): \~37

**References**

Poore, T. (2023).

Avital Hahamy, Haim Dubossarsky & Timothy E. J. Behrens. (2023).

Xu, Y., Long, X., Feng, J. et al. Interacting spiral wave patterns
underlie complex brain dynamics and are related to cognitive processing.
Nat Hum Behav (2023).
