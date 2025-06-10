// src/database/seeds/questions.seeder.ts
import { DataSource } from 'typeorm';
import { Question } from '@app/quiz/entities/question.entity';

export const seedQuestions = async (dataSource: DataSource) => {
  const questionRepository = dataSource.getRepository(Question);

  const questionsData = [
    {
      id: 1, // Explicitly set ID for easy mapping
      text: 'At a large social gathering, you are most likely to:',
      options: [
        {
          text: 'interact with many different people, strangers included.',
          correspondence: 'D',
        }, //
        {
          text: 'talk one-on-one mostly with people you already know.',
          correspondence: 'N',
        }, //
        {
          text: 'use the opportunity to make important contacts.',
          correspondence: 'A',
        }, //
        {
          text: 'leave as soon as it is polite to do so.',
          correspondence: 'C',
        }, //
      ],
    },
    {
      id: 2,
      text: 'When you first arrive at a meeting you are usually…',
      options: [
        {
          text: '...a bit late, and try to sneak in the back without being noticed.',
          correspondence: 'N',
        }, //
        {
          text: '...purposely a bit late, you like to get there when things have started happening.',
          correspondence: 'D',
        }, //
        {
          text: '...arrive right on time and feel impatient if the meeting starts late.',
          correspondence: 'A',
        }, //
        {
          text: '...arrive early so that you can be ready and organized when the meeting starts.',
          correspondence: 'C',
        }, //
      ],
    },
    {
      id: 3,
      text: 'If you were famous in your field, which career would most suit you?',
      options: [
        { text: 'Celebrity', correspondence: 'D' }, //
        { text: 'CEO', correspondence: 'A' }, //
        { text: 'Inventor', correspondence: 'C' }, //
        { text: 'Humanitarian', correspondence: 'N' }, //
      ],
    },
    {
      id: 4,
      text: 'What style of entertainment do you most enjoy watching?',
      options: [
        { text: 'Something warm and friendly.', correspondence: 'N' }, //
        { text: 'Something quirky and intellectual.', correspondence: 'C' }, //
        { text: 'Something political or satirical.', correspondence: 'A' }, //
        { text: 'Something wild, outrageous and/or fun.', correspondence: 'D' }, //
      ],
    },
    {
      id: 5,
      text: 'Of these four personality traits, you consider your strongest to be:',
      options: [
        { text: 'Compassion', correspondence: 'N' }, //
        { text: 'Assertiveness', correspondence: 'A' }, //
        { text: 'Imagination', correspondence: 'D' }, //
        { text: 'Persistence', correspondence: 'C' }, //
      ],
    },
    {
      id: 6,
      text: 'The statement that most closely describes you is:',
      options: [
        { text: 'Sensible and frugal.', correspondence: 'C' }, //
        { text: 'Rational and quick-witted.', correspondence: 'A' }, //
        { text: 'Sensitive and reliable.', correspondence: 'N' }, //
        { text: 'Creative and fiery', correspondence: 'D' }, //
      ],
    },
    {
      id: 7,
      text: 'Which appeals to you the most?',
      options: [
        { text: 'Taking action on a calculated risk.', correspondence: 'A' }, //
        {
          text: 'Creating harmonious human relationships.',
          correspondence: 'N',
        }, //
        {
          text: 'Discovering the secret behind a complex mystery.',
          correspondence: 'C',
        }, //
        { text: 'Going to an exciting social event.', correspondence: 'D' }, //
      ],
    },
    {
      id: 8,
      text: 'Which rules you more?',
      options: [
        { text: 'Your heart', correspondence: 'N' }, //
        { text: 'Your head', correspondence: 'C' }, //
        { text: 'Your wallet', correspondence: 'A' }, //
        { text: 'Your desires', correspondence: 'D' }, //
      ],
    },
    {
      id: 9,
      text: 'New and non-routine interaction with others:',
      options: [
        {
          text: '...usually stimulates and energizes you.',
          correspondence: 'D',
        }, //
        {
          text: '...revitalizes you, if you have a special connection with someone in the process.',
          correspondence: 'N',
        }, //
        {
          text: "...stresses you out, and you aren't afraid to let people know it.",
          correspondence: 'A',
        }, //
        {
          text: '...stresses you out, so you quietly slip away when no one is watching.',
          correspondence: 'C',
        }, //
      ],
    },
    {
      id: 10,
      text: 'When doing group projects, which part of the process is most important to you?',
      options: [
        { text: 'Creating relationships with people.', correspondence: 'N' }, //
        {
          text: 'Sorting out who is playing what role in the project.',
          correspondence: 'A',
        }, //
        {
          text: 'Organizing the way the project is done.',
          correspondence: 'C',
        }, //
        {
          text: 'Making sure the process of doing it is fun and exciting.',
          correspondence: 'D',
        }, //
      ],
    },
    {
      id: 11,
      text: 'If you suddenly have some spare time on a weekend, you usually WANT to:',
      options: [
        {
          text: '...contact several friends and see if there is something fun going on.',
          correspondence: 'D',
        }, //
        {
          text: '...have some quality time with one or a just a few people.',
          correspondence: 'N',
        }, //
        {
          text: '...get a number of important things done on your TO DO list.',
          correspondence: 'A',
        }, //
        {
          text: '...focus your energy on one specific hobby or project.',
          correspondence: 'C',
        }, //
      ],
    },
    {
      id: 12,
      text: "You want to buy a gift for a friend you don't know very well. You are most likely to:",
      options: [
        {
          text: 'Buy the first thing you see that you intuitively think they would like.',
          correspondence: 'D',
        }, //
        {
          text: 'Carefully find just the right thing, after much comparison-shopping.',
          correspondence: 'N',
        }, //
        {
          text: 'Buy the same special gift you always buy for special people.',
          correspondence: 'C',
        }, //
        {
          text: 'Get someone else to buy the gift, or just give your friend some money.',
          correspondence: 'A',
        }, //
      ],
    },
    {
      id: 13,
      text: 'Which description most fits you?',
      options: [
        { text: 'Hard working and ambitious', correspondence: 'A' }, //
        { text: 'Animated and friendly', correspondence: 'D' }, //
        { text: 'Focused and efficient', correspondence: 'C' }, //
        { text: 'Cooperative and gentle', correspondence: 'N' }, //
      ],
    },
    {
      id: 14,
      text: 'Most of the time, when working, you prefer:',
      options: [
        { text: 'To do your job quietly on your own.', correspondence: 'C' }, //
        {
          text: 'To be an integral part of a team working together.',
          correspondence: 'N',
        }, //
        {
          text: 'To influence the team in new and creative directions',
          correspondence: 'D',
        }, //
        {
          text: 'To be the leader and structure-maker for the team',
          correspondence: 'A',
        }, //
      ],
    },
    {
      id: 15,
      text: 'When the phone rings do you',
      options: [
        {
          text: '...answer it immediately and talk at length.',
          correspondence: 'D',
        }, //
        {
          text: '...look forward to the call, but wait a few rings before answering.',
          correspondence: 'N',
        }, //
        {
          text: '...deal with whoever it is quickly and efficiently.',
          correspondence: 'A',
        }, //
        { text: '...hope someone else will answer it.', correspondence: 'C' }, //
      ],
    },
    {
      id: 16,
      text: 'Your favorite type of clothing to wear:',
      options: [
        {
          text: 'Something comfortable, practical and low key.',
          correspondence: 'C',
        }, //
        {
          text: 'A unique ensemble that makes a statement.',
          correspondence: 'D',
        }, //
        { text: 'An expensive-looking power outfit.', correspondence: 'A' }, //
        { text: 'Something easy-going and nice.', correspondence: 'N' }, //
      ],
    },
    {
      id: 17,
      text: 'Which kind of movie do you most prefer:',
      options: [
        {
          text: 'Mystery, documentary or science fiction',
          correspondence: 'C',
        }, //
        { text: 'Feel-good story or romance', correspondence: 'N' }, //
        { text: 'Epic, historical or action', correspondence: 'A' }, //
        { text: 'Comedy, psychological thriller, glitzy', correspondence: 'D' }, //
      ],
    },
    {
      id: 18,
      text: 'Which is more admirable:',
      options: [
        {
          text: 'The ability to organize and be methodical.',
          correspondence: 'C',
        }, //
        {
          text: 'The ability to take charge in a chaotic situation.',
          correspondence: 'A',
        }, //
        {
          text: 'The ability to motivate others to succeed.',
          correspondence: 'D',
        }, //
        {
          text: 'The ability to make people feel comfortable and included.',
          correspondence: 'N',
        }, //
      ],
    },
    {
      id: 19,
      text: 'In terms of comedy, I most closely identify with people who can:',
      options: [
        { text: '…tell a heartwarming, funny story.', correspondence: 'N' }, //
        { text: '…tell a good joke.', correspondence: 'A' }, //
        {
          text: '…create great characters through movement, voice, costume, etc.',
          correspondence: 'D',
        }, //
        {
          text: '…tell a witty one-liner, pun, or wordplay.',
          correspondence: 'C',
        }, //
      ],
    },
    {
      id: 20,
      text: 'If a conflict arises between a friend and I, my first reaction is to:',
      options: [
        {
          text: '…make sure they understand my position on things.',
          correspondence: 'A',
        }, //
        {
          text: "…make sure the relationship doesn't get damaged.",
          correspondence: 'N',
        }, //
        { text: '…avoid that person for a while.', correspondence: 'C' }, //
        {
          text: '…find a compromise, where we both get at least part of what we want.',
          correspondence: 'D',
        }, //
      ],
    },
  ];

  // Check if questions already exist to prevent duplicates on multiple runs
  const existingQuestions = await questionRepository.count();
  if (existingQuestions === 0) {
    await questionRepository.save(questionsData);
    console.log('Questions seeded successfully!');
  } else {
    console.log('Questions already exist in the database. Skipping seeding.');
  }
};
