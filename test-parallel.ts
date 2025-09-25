const EXAMPLE_TEXT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras congue in est nec mattis. Curabitur volutpat eros sit amet maximus tincidunt. Nullam quam neque, gravida quis tempus at, laoreet a tortor. Fusce sagittis sapien felis, vel faucibus lacus efficitur at. Praesent et venenatis velit. Aliquam efficitur odio sagittis luctus blandit. Quisque venenatis enim a mi congue mattis. In sed ligula convallis dui egestas dapibus in ullamcorper libero. Etiam eget tempor enim. Vestibulum vitae mollis diam. Sed tincidunt augue quis enim rhoncus pharetra. Nam eget quam lacus. Nunc vel pretium purus. Donec tincidunt, erat a egestas maximus, sem ante congue purus, quis accumsan orci urna non enim. Pellentesque congue laoreet neque. Proin commodo id nulla placerat pulvinar. Etiam gravida nulla et odio gravida pulvinar. Etiam eu risus erat. Aliquam feugiat mollis vehicula. Fusce et nisi sollicitudin odio hendrerit imperdiet. Etiam suscipit tincidunt purus in interdum. Proin vulputate gravida lorem, sed luctus magna hendrerit at. Donec pellentesque dignissim scelerisque. Phasellus id nibh ac nisl lobortis pulvinar placerat sit amet nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas pretium, risus in ultrices eleifend, quam nibh tincidunt ipsum, non tincidunt mi nisi in dui. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed laoreet mauris ligula, ac consequat dui lacinia posuere. Vestibulum blandit odio ac urna viverra, at dictum massa mollis. Nunc mattis nisl vel sem ultricies, eget bibendum purus pretium. Ut quis est tristique massa blandit molestie. Phasellus faucibus rhoncus sem, non sagittis enim pharetra eu. Mauris rhoncus fringilla neque, sed tincidunt neque condimentum vel. Pellentesque rhoncus purus id urna tempus, a convallis massa consequat. Aliquam vitae nibh euismod, gravida justo id, tincidunt orci. Donec eget eros sed dui suscipit pulvinar rutrum vel urna. Phasellus commodo risus sit amet nunc sodales, in mollis tortor tincidunt. Nulla tortor justo, sagittis nec tincidunt non, dictum et mauris. Nunc vitae neque interdum lacus sodales porttitor. Quisque suscipit enim ut venenatis consectetur. Pellentesque nec consectetur lectus. Nam in augue ac justo convallis euismod quis sagittis nisi. Maecenas hendrerit, elit quis viverra volutpat, ligula orci commodo felis, a elementum nibh nisl eget mauris. Aenean sapien neque, hendrerit sit amet leo et, luctus efficitur quam. Etiam dui purus, faucibus scelerisque nulla sit amet, sodales luctus ante. In metus est, facilisis et faucibus eu, laoreet vitae tortor. Vestibulum euismod facilisis ante non finibus. Curabitur feugiat elit eu ultricies rutrum. Donec posuere lorem nunc, ut bibendum tortor luctus id. Vivamus in iaculis elit. Phasellus interdum est eget lorem faucibus, ut bibendum ante pretium. Fusce id rutrum est, semper lobortis neque. Morbi quis lobortis odio, id ultrices sapien. Quisque eu sem nec orci facilisis placerat in maximus nisi. Phasellus lobortis non mauris id ultrices. Donec tristique consectetur libero in pretium. Ut vehicula faucibus massa, eu commodo nulla facilisis sed. Maecenas id libero at tortor efficitur tincidunt. Mauris feugiat non lectus non rutrum. Sed ultricies pulvinar nulla, at hendrerit mi accumsan a. Nulla a accumsan nisi. Nullam in risus consectetur, posuere nibh consequat, laoreet lorem. Praesent vel tincidunt nunc, eu volutpat erat. Aenean luctus orci lacus, at tincidunt massa aliquam nec. Aliquam iaculis quam elit, ut scelerisque nisi feugiat quis. Etiam at magna dui. Integer gravida, ligula at consequat ultricies, odio nisi placerat est, ut cursus ante quam ac ex. Praesent semper aliquet sodales. Curabitur vel tellus non nisi porta ullamcorper sit amet maximus lacus."

function formatDuration(duration: number) {
  return `${(duration / 1000).toFixed(2)}s`;
}

const ITERATIONS = 20
// const API_URL = 'https://punctuate.byst.re/api/punctuate'
const API_URL = 'https://ai.withsubtitles.app/api/punctuate'
const API_KEY = process.env.API_KEY!

async function makeRequest(text: string) {
  const startAt = performance.now();
  const response = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ text }),
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  const endAt = performance.now();
  return { response, duration: endAt - startAt };
}

async function testParallel() {
  const startAt = performance.now();
  const promises = [];
  for (let i = 0; i < ITERATIONS; i++) {
    promises.push(makeRequest(EXAMPLE_TEXT));
  }
  const results = await Promise.all(promises);
  const endAt = performance.now();
  // console.log(results);
  console.log(`Total time: ${formatDuration(endAt - startAt)}`);
  results.forEach((result, index) => {
    console.log(`[${index}]: ${formatDuration(result.duration)}`);
  });
}

async function testSequential() {
  const startAt = performance.now();
  const results = [];
  for (let i = 0; i < ITERATIONS; i++) {
    const result = await makeRequest(EXAMPLE_TEXT);
    if (i === 0) {
      result.response.json().then(json => console.log(json));
    }
    results.push(result);
  }
  const endAt = performance.now();
  // console.log(results);
  console.log(`Total time: ${formatDuration(endAt - startAt)}`);
  results.forEach((result, index) => {
    console.log(`[${index}]: ${formatDuration(result.duration)}`);
  });
}

async function main() {
  console.log('Testing sequential requests...');
  await testSequential();

  console.log('--------------------------------');
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Testing parallel requests...');
  await testParallel();
}

main();
