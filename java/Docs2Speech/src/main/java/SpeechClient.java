// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import com.google.cloud.texttospeech.v1.AudioConfig;
import com.google.cloud.texttospeech.v1.AudioEncoding;
import com.google.cloud.texttospeech.v1.SsmlVoiceGender;
import com.google.cloud.texttospeech.v1.SynthesisInput;
import com.google.cloud.texttospeech.v1.SynthesizeSpeechResponse;
import com.google.cloud.texttospeech.v1.TextToSpeechClient;
import com.google.cloud.texttospeech.v1.VoiceSelectionParams;
import com.google.protobuf.ByteString;

import java.io.IOException;

/**
 * SpeechClient is a wrapper for the Cloud TextToSpeech API.
 */
class SpeechClient {
    private TextToSpeechClient client;

    public SpeechClient() {
        // Instantiates a client
        try {
            client = TextToSpeechClient.create();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Creates the audio of the provided text and returns the mp3 file bytes.
     * @param text the text to synthesize
     */
    ByteString createAudio(String text) {
        // Set the text input to be synthesized
        SynthesisInput input = SynthesisInput.newBuilder()
                .setText(text)
                .build();

        VoiceSelectionParams voice = VoiceSelectionParams.newBuilder()
                .setLanguageCode("en-US")
                .setSsmlGender(SsmlVoiceGender.NEUTRAL)
                .build();

        // Select the type of audio file you want returned
        AudioConfig audioConfig = AudioConfig.newBuilder()
                .setAudioEncoding(AudioEncoding.MP3)
                .build();

        // Perform the text-to-speech request on the text input with the selected voice parameters
        // and audio file type
        SynthesizeSpeechResponse response = client.synthesizeSpeech(input, voice,
                audioConfig);

        // Get the audio contents from the response
        ByteString audioContents = response.getAudioContent();
        return audioContents;
    }
}
