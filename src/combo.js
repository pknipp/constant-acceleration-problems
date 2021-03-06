const combo = () => {

  let vi, vf;
  let [aMax, tMax, vMax] = [9, 9, 9];
  let a = (1 + Math.floor(aMax * Math.random())) * (Math.random() < 0.5 ? -1 : 1);
  let t = 1 + Math.floor(tMax * Math.random());

  // case = 0 (one v = 0), 1 (x = 0), or 2 (generic)
  let Case = Math.floor(3 * Math.random());

  if (!Case) {
    [vi, vf] = Math.random() < 0.5 ? [0, a * t] : [-a * t, 0];
  } else {
    vi = (Case === 1) ? -a * t / 2 : (1 + Math.floor(vMax * Math.random())) * (Math.random() < 0.5 ? -1 : 1);
    vf = vi + a * t;
  }
  let x = (2 * vi + a * t) * t / 2;

  let vfWords = Math.abs(vf) + " m/s" + (vf > 0 ? " forwards" : " backwards");
  let phrases = [
      [1, [" accelerates", " accelerating"], ` at ${a} m/s/s`, "acceleration", a + ' m/s/s', 'a'],
      [1, [" moves", " moving"],  ` ${!x ? " back to its initial position" : (Math.abs(x) + " m" + ((x > 0) ? " forwards" : " backwards"))}`, "displacement", x + ' m', 'x'],
      [1, [" moves", " moving"], ` for ${t} s`, "duration", t + ' s', 't'],
      [0, [" starts", " starting"], !vi ? " from rest" : ((vi > 0 ? " forwards" : " backwards") + " at " + Math.abs(vi) + " m/s"), "initial velocity", vi + ' m/s', 'vi'],
      [2, [!vf ? " stops" : " reaches " + vfWords, !vf ? " stopping" : " reaching " + vfWords], "", "final velocity", vf + ' m/s', 'vf']
  ];
  // Randomly shuffle the phrases.
  for (let i = phrases.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [phrases[i], phrases[j]] = [phrases[j], phrases[i]];
  }
  let sought = phrases[3];
  let missing= phrases[4];

  let problem = {};
  let word1 = phrases[0][0] < phrases[1][0] ? " before" : phrases[0][0] > phrases[1][0] ? " after" : " while";
  let word2 = Math.sign(phrases[2][0] - phrases[0][0]) === Math.sign(phrases[1][0] - phrases[0][0]) ? " and" :
              phrases[2][0] === phrases[0][0] ? " while" :
              phrases[2][0] > phrases[1][0] ? " before" : " after";
  problem.statement = "An object" + phrases[0][1][0] + phrases[0][2] + word1 + phrases[1][1][1] + phrases[1][2] + word2+ phrases[2][1][1] + phrases[2][2] + ".";
  problem.question = `What is the ${sought[3]} of this process?`;
  problem.answer = sought[4];
  // If the equation is quadratic in t, the problem MAY involve solving a nontrivial quadratic equation.
  if ((('vi' === missing[5] && vf) || ('vf' === missing[5] && vi)) && sought[5] === 't' && x) {
    problem.difficult = true;
    let tVertex = missing[5] === 'vf' ? -vi / a : vf / a;
    let dt = Math.abs(t - tVertex);
    // In certain cases the user may face two distinct positive roots.
    if (tVertex > 0 && tVertex !== t && t - dt > 0) {
      let supplement = ["shortest", "longest"][Number(t > tVertex)] + " possible ";
      problem.question = problem.question.split("duration").join(supplement + "duration");
    }
  }

  problem.note = `The "missing quantity" for this problem is the ${missing[3]}, which equals ${missing[4]}.`;
  return problem;
}

module.exports = combo;
