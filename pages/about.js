import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head>
        <title>About - Milk & Mercy</title>
        <meta name="description" content="Learn more about Milk & Mercy blog" />
      </Head>

      <div className="about-page">
        <h1>About Milk & Mercy</h1>

        <div className="about-content">
          <p>
            Welcome to Milk & Mercy, a space for thoughtful reflection and meaningful stories.
          </p>

          <p>
            This blog explores themes of faith, life, compassion, and the everyday moments that
            shape our journey. The name &ldquo;Milk & Mercy&rdquo; represents nourishment for both body and
            soul – the sustenance we need and the grace we extend to ourselves and others.
          </p>

          <p>
            Whether you&apos;re here for inspiration, contemplation, or simply to read some stories,
            I hope you find something that resonates with you.
          </p>

          <h2>Connect</h2>
          <p>
            Feel free to reach out with your thoughts, questions, or just to say hello.
            Every story shared here is an invitation to conversation.
          </p>
        </div>
      </div>
    </>
  );
}
