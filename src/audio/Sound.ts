module Sound {

    export var context = new webkitAudioContext();

    export function play(buffer, time = 0) {

        if(!buffer)
          Logger.error("buffer null");

          var sound = context.createBufferSource();
          sound.buffer = buffer;
          sound.connect(context.destination);
          sound.noteOn(time);
    }
}
